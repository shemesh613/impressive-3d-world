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
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('file:///' + filePath, {waitUntil:'networkidle2',timeout:15000});
  await new Promise(r=>setTimeout(r,1500));
  await page.evaluate(() => document.getElementById('playBtn')?.click());
  await new Promise(r=>setTimeout(r,500));
  // Drive forward for 15 seconds to pass collectibles, obstacles, tunnels
  await page.keyboard.down('ArrowUp');
  await new Promise(r=>setTimeout(r,5000));
  await page.screenshot({path:'ss_r_1.png'});
  await new Promise(r=>setTimeout(r,5000));
  await page.screenshot({path:'ss_r_2.png'});
  await new Promise(r=>setTimeout(r,5000));
  await page.screenshot({path:'ss_r_3.png'});
  await page.keyboard.up('ArrowUp');
  const state = await page.evaluate(() => {
    try {
      return {
        score: document.getElementById('scoreVal')?.textContent,
        dist: document.getElementById('distVal')?.textContent,
        speed: document.getElementById('speedVal')?.textContent,
        lives: document.getElementById('livesVal')?.textContent,
        carZ: typeof car !== 'undefined' ? Math.floor(car.position.z) : 'N/A',
        gameActive: typeof gameActive !== 'undefined' ? gameActive : 'N/A'
      };
    } catch(e) { return {error: e.message}; }
  });
  console.log('STATE:', JSON.stringify(state));
  if (errors.length) console.log('ERRORS:', JSON.stringify(errors));
  else console.log('No JS errors!');
  await browser.close();
})();
