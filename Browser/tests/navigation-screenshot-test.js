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
    browser_web_vital_fcp: ['p(95)<1000'],
  },
};

export default async function () {
  const page = await browser.newPage();

  try {
    console.log('Navigating to K6 test site...');
    await page.goto('https://test.k6.io/', { waitUntil: 'networkidle' });
    
    await page.screenshot({ path: 'screenshots/homepage.png' });
    console.log('Screenshot taken: homepage.png');
    
    const navigationLinks = page.locator('nav a');
    const linkCount = await navigationLinks.count();
    
    check(page, {
      'Navigation links are present': () => linkCount > 0,
    });
    
    console.log('Clicking on "News" link...');
    await page.locator('a[href="/news.php"]').click();
    
    await page.waitForLoadState('networkidle');
    
    const newsHeading = page.locator('h1');
    const newsHeadingText = await newsHeading.textContent();
    
    check(page, {
      'News page loaded successfully': () => newsHeadingText.includes('News'),
    });
    
    await page.screenshot({ path: 'screenshots/news-page.png' });
    console.log('Screenshot taken: news-page.png');
    
    console.log('Navigating to Contacts page...');
    await page.locator('a[href="/contacts.php"]').click();
    
    await page.waitForLoadState('networkidle');
    
    const contactsHeading = page.locator('h1');
    const contactsHeadingText = await contactsHeading.textContent();
    
    check(page, {
      'Contacts page loaded successfully': () => contactsHeadingText.includes('Contacts'),
    });
    
    await page.screenshot({ path: 'screenshots/contacts-page.png' });
    console.log('Screenshot taken: contacts-page.png');
    
    console.log('Going back to homepage...');
    await page.goBack();
    await page.goBack();
    
    await page.waitForLoadState('networkidle');
    
    const homeTitle = await page.title();
    check(page, {
      'Successfully navigated back to homepage': () => homeTitle === 'test.k6.io',
    });
    
    await page.screenshot({ path: 'screenshots/back-to-homepage.png' });
    console.log('Screenshot taken: back-to-homepage.png');
    
  } finally {
    await page.close();
  }
}