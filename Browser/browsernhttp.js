import { browser } from 'k6/browser';
import { check } from 'https://jslib.k6.io/k6-utils/1.5.0/index.js';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import http from 'k6/http';

const BASE_URL = __ENV.BASE_URL || 'https://quickpizza.grafana.com';

export const options = {
  scenarios: {
    load: {
      exec: 'getPizza',
      executor: 'ramping-vus',
      stages: [
        { duration: '5s', target: 5 },
        { duration: '10s', target: 5 },
        { duration: '5s', target: 0 },
      ],
      startTime: '10s',
    },
    browser: {
      exec: 'checkFrontend',
      executor: 'constant-vus',
      vus: 1,
      duration: '30s',
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    browser_web_vital_fcp: ['p(95) < 1000'],
    browser_web_vital_lcp: ['p(95) < 2000'],
  },
};

export function getPizza() {
  const restrictions = {
    maxCaloriesPerSlice: 500,
    mustBeVegetarian: false,
    excludedIngredients: ['pepperoni'],
    excludedTools: ['knife'],
    maxNumberOfToppings: 6,
    minNumberOfToppings: 2,
  };

  const res = http.post(`${BASE_URL}/api/pizza`, JSON.stringify(restrictions), {
    headers: {
      'Content-Type': 'application/json',
      'X-User-ID': randomIntBetween(1, 30000),
    },
  });

  check(res, {
    'status is 200': (res) => res.status === 200,
  });
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
      'recommendation': async lo => await lo.textContent() != '',
    });
  } finally {
    await page.close();
  }
}


