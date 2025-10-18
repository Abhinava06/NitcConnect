const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', (msg) => {
    console.log('[browser console]', msg.type(), msg.text());
  });

  page.on('pageerror', (err) => {
    console.error('[page error]', err);
  });

  try {
  const res = await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle' });
    console.log('HTTP status:', res.status());
  } catch (e) {
    console.error('navigation error', e);
  }

  await browser.close();
})();
