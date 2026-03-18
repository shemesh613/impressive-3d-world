const puppeteer = require('puppeteer');
const path = require('path');
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox','--window-size=1280,720','--window-position=0,0']
  });
  const page = await browser.newPage();
  await page.setViewport({width:1280,height:720});
  const filePath = path.resolve('index.html').split(path.sep).join('/');
  const url = 'file:///' + filePath;
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(url, {waitUntil:'networkidle2',timeout:15000});
  await new Promise(r=>setTimeout(r,2000));
  await page.screenshot({path:'ss1_start.png'});
  console.log('Screenshot 1: start screen');

  // Click play
  const clicked = await page.evaluate(() => {
    const btn = document.getElementById('playBtn');
    if (btn) { btn.click(); return true; }
    return false;
  });
  console.log('Play clicked:', clicked);
  await new Promise(r=>setTimeout(r,2000));
  await page.screenshot({path:'ss2_playing.png'});

  // Drive forward
  await page.keyboard.down('ArrowUp');
  await new Promise(r=>setTimeout(r,4000));
  await page.screenshot({path:'ss3_driving.png'});
  await page.keyboard.up('ArrowUp');

  // Get game state
  const state = await page.evaluate(() => {
    try {
      return {
        score: document.getElementById('scoreVal')?.textContent,
        dist: document.getElementById('distVal')?.textContent,
        speed: document.getElementById('speedVal')?.textContent,
        lives: document.getElementById('livesVal')?.textContent,
        hudVisible: document.getElementById('hud')?.style.display,
        canvasExists: !!document.querySelector('canvas'),
        carZ: typeof car !== 'undefined' ? Math.floor(car.position.z) : 'N/A'
      };
    } catch(e) { return {error: e.message}; }
  });
  console.log('STATE:', JSON.stringify(state));
  if (errors.length) console.log('ERRORS:', JSON.stringify(errors));
  else console.log('No JS errors!');

  await browser.close();
})();
