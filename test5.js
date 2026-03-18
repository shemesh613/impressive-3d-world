const puppeteer = require('puppeteer');
const path = require('path');
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox','--window-size=1280,720','--window-position=0,0','--allow-file-access-from-files']
  });
  const page = await browser.newPage();
  await page.setViewport({width:1280,height:720});
  // Use the LIVE site instead of local file
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('https://shemesh613.github.io/impressive-3d-world/', {waitUntil:'networkidle2',timeout:20000});
  await new Promise(r=>setTimeout(r,2000));
  await page.screenshot({path:'ss_live_start.png'});
  await page.evaluate(() => document.getElementById('playBtn')?.click());
  await new Promise(r=>setTimeout(r,500));
  await page.keyboard.down('ArrowUp');
  await new Promise(r=>setTimeout(r,5000));
  await page.evaluate(() => {
    const g=document.getElementById('choiceGreen');
    if(g && document.getElementById('scenario')?.style.display==='block') g.click();
  });
  await new Promise(r=>setTimeout(r,4000));
  await page.screenshot({path:'ss_live_play.png'});
  await page.evaluate(() => {
    const g=document.getElementById('choiceGreen');
    if(g && document.getElementById('scenario')?.style.display==='block') g.click();
  });
  await new Promise(r=>setTimeout(r,6000));
  await page.screenshot({path:'ss_live_far.png'});
  await page.keyboard.up('ArrowUp');
  const state = await page.evaluate(() => {
    try { return {
      score: document.getElementById('scoreVal')?.textContent,
      dist: document.getElementById('distVal')?.textContent,
      speed: document.getElementById('speedVal')?.textContent,
      lives: document.getElementById('livesVal')?.textContent,
      carZ: typeof car !== 'undefined' ? Math.floor(car.position.z) : 'N/A'
    }; } catch(e) { return {error: e.message}; }
  });
  console.log('STATE:', JSON.stringify(state));
  if (errors.length) console.log('ERRORS:', JSON.stringify(errors));
  else console.log('No JS errors!');
  await browser.close();
})();
