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
    checks: ['rate>=0.8'],
    browser_web_vital_lcp: ['p(95)<2000'],
  },
};

export default async function () {
  const page = await browser.newPage();

  try {
    await page.goto('https://test.k6.io/my_messages.php', { waitUntil: 'networkidle' });
    
    const loginForm = page.locator('form[action="/my_messages.php"]');
    
    check(loginForm, {
      'Login form is visible': () => loginForm.isVisible(),
    });
    
    const usernameInput = page.locator('input[name="login"]');
    const passwordInput = page.locator('input[name="password"]');
    const submitButton = page.locator('input[type="submit"]');
    
    await usernameInput.type('admin');
    await passwordInput.type('123');
    
    console.log('Form filled with username and password');
    
    await submitButton.click();
    
    await page.waitForLoadState('networkidle');
    
    const pageTitle = await page.title();
    console.log('Page title after login:', pageTitle);
    
    const pageContent = await page.content();
    console.log('Page URL after login:', page.url());
    
    check(page, {
      'Successfully logged in': () => pageContent.includes('Welcome') || pageContent.includes('Messages') || !pageContent.includes('Password'),
    });
    
    const messageForm = page.locator('form[action="/my_messages.php"]');
    if (await messageForm.isVisible()) {
      const messageInput = page.locator('textarea[name="message"]');
      await messageInput.type('This is a test message from K6 browser automation!');
      
      const sendButton = page.locator('input[value="Send message"]');
      await sendButton.click();
      
      await page.waitForLoadState('networkidle');
      
      check(page, {
        'Message sent successfully': () => page.locator('.message').isVisible(),
      });
    }
    
  } finally {
    await page.close();
  }
}