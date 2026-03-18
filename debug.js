const puppeteer = require('puppeteer-core');
const execPath = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: execPath,
    headless: false,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const errors = [];
  page.on('pageerror', e => errors.push('PAGE_ERROR: ' + e.message));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push('CONSOLE_ERROR: ' + msg.text());
  });

  await page.goto('https://shemesh613.github.io/impressive-3d-world/', {
    waitUntil: 'domcontentloaded',
    timeout: 45000
  });
  await new Promise(r => setTimeout(r, 10000));

  console.log('=== JS ERRORS ===');
  errors.forEach(e => console.log(e));
  console.log('=== END ERRORS ===');

  const info = await page.evaluate(() => {
    return {
      startScreenDisplay: document.getElementById('startScreen') ? document.getElementById('startScreen').style.display : 'NOT_FOUND',
      playBtnExists: document.getElementById('playBtn') !== null,
      canvasExists: document.querySelector('canvas') !== null,
      canvasCount: document.querySelectorAll('canvas').length
    };
  });
  console.log('Page info:', JSON.stringify(info));

  await page.screenshot({ path: 'C:/Users/user/Desktop/game-debug.png' });
  await browser.close();
})();
