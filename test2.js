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
  // Click play
  await page.evaluate(() => document.getElementById('playBtn')?.click());
  await new Promise(r=>setTimeout(r,1000));
  // Drive forward longer
  await page.keyboard.down('ArrowUp');
  await new Promise(r=>setTimeout(r,8000));
  await page.screenshot({path:'ss_drive1.png'});
  // Steer right then left to test curves
  await page.keyboard.down('ArrowRight');
  await new Promise(r=>setTimeout(r,2000));
  await page.keyboard.up('ArrowRight');
  await page.screenshot({path:'ss_drive2.png'});
  await page.keyboard.down('ArrowLeft');
  await new Promise(r=>setTimeout(r,2000));
  await page.keyboard.up('ArrowLeft');
  await new Promise(r=>setTimeout(r,3000));
  await page.keyboard.up('ArrowUp');
  await page.screenshot({path:'ss_drive3.png'});
  const state = await page.evaluate(() => {
    try {
      return {
        score: document.getElementById('scoreVal')?.textContent,
        dist: document.getElementById('distVal')?.textContent,
        speed: document.getElementById('speedVal')?.textContent,
        lives: document.getElementById('livesVal')?.textContent,
        carZ: typeof car !== 'undefined' ? Math.floor(car.position.z) : 'N/A',
        greensN: typeof greens !== 'undefined' ? greens.length : 'N/A',
        obsN: typeof obstacles !== 'undefined' ? obstacles.length : 'N/A',
        gameActive: typeof gameActive !== 'undefined' ? gameActive : 'N/A'
      };
    } catch(e) { return {error: e.message}; }
  });
  console.log('STATE:', JSON.stringify(state));
  if (errors.length) console.log('ERRORS:', JSON.stringify(errors));
  else console.log('No JS errors!');
  await browser.close();
})();
