import { browser } from 'k6/browser';
import { check } from 'https://jslib.k6.io/k6-utils/1.5.0/index.js';
import { ServiceDisruptor } from 'k6/x/disruptor';

const BASE_URL = __ENV.BASE_URL;

export const options = {
  scenarios: {
    disrupt: {
      executor: 'shared-iterations',
      iterations: 1,
      vus: 1,
      exec: 'disrupt',
    },
    browser: {
      executor: 'constant-vus',
      vus: 1,
      duration: '10s',
      startTime: '10s',
      exec: 'browser',
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
  thresholds: {
    browser_web_vital_fcp: ['p(95) < 1000'],
    browser_web_vital_lcp: ['p(95) < 2000'],
  },
};

// Add faults to the service by introducing a delay of 1s and 503 errors to 10% of the requests.
const fault = {
  averageDelay: '1000ms',
  errorRate: 0.1,
  errorCode: 503,
};

export function disrupt() {
  const disruptor = new ServiceDisruptor('pizza-info', 'pizza-ns');
  const targets = disruptor.targets();
  if (targets.length == 0) {
    throw new Error('expected list to have one target');
  }

  disruptor.injectHTTPFaults(fault, '20s');
}

export async function checkFrontend() {
  const page = await browser.newPage();

  try {
    await page.goto(BASE_URL);
    await check(page.locator('h1'), {
      'header': async lo => await lo.textContent() == 'Looking to break out of your pizza routine?'
    });

    await Promise.all([
      page.locator('//button[. = "Pizza, Please!"]').click(),
      page.waitForTimeout(500),
    ]);
    await page.screenshot({ path: `screenshots/${__ITER}.png` });

    await check(page.locator('div#recommendations'), {
      recommendation: async lo => await lo.textContent() != '',
    });
  } finally {
    await page.close();
  }
}