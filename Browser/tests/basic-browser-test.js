import { browser } from 'k6/browser';
import { check } from 'k6';

export const options = {
  scenarios: {
    ui: {
      executor: 'shared-iterations',
      vus: 1,
      iterations: 1,
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
  thresholds: {
    checks: ['rate==1.0'],
  },
};

export default async function () {
  const page = await browser.newPage();

  try {
    await page.goto('https://test.k6.io/', { waitUntil: 'networkidle' });
    
    const title = await page.title();
    console.log('Page title:', title);
    
    check(page, {
      'Page title is correct': () => title === 'test.k6.io',
    });
    
    const heading = await page.locator('h1').textContent();
    console.log('Main heading:', heading);
    
    check(page, {
      'Main heading exists': () => heading.length > 0,
    });
    
    const pageContent = await page.content();
    check(page, {
      'Page contains test content': () => pageContent.includes('test.k6.io'),
    });
    
  } finally {
    await page.close();
  }
}