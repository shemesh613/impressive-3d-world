const puppeteer = require('puppeteer');
const path = require('path');
(async () => {
  const browser = await puppeteer.launch({headless:'new',args:['--no-sandbox','--disable-gpu']});
  const page = await browser.newPage();
  await page.setViewport({width:1280,height:720});
  const filePath = path.resolve('index.html').split(path.sep).join('/');
  const url = 'file:///' + filePath;
  const errors = [];
  const logs = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if(m.type()==='error') logs.push(m.text()); });
  await page.goto(url, {waitUntil:'networkidle2',timeout:15000});
  await new Promise(r=>setTimeout(r,2000));
  const state = await page.evaluate(() => {
    const r = {};
    r.hasThree = typeof THREE !== 'undefined';
    r.hasScene = typeof scene !== 'undefined';
    r.hasCar = typeof car !== 'undefined';
    r.hasStartScreen = !!document.getElementById('startScreen');
    r.startDisplay = document.getElementById('startScreen')?.style.display;
    r.playBtnExists = !!document.getElementById('playBtn');
    r.canvasExists = !!document.querySelector('canvas');
    r.webglError = document.body.innerHTML.includes('WebGL');
    try { r.meshCount = scene?.children?.length; } catch(e) { r.meshCount = 'error'; }
    return r;
  });
  console.log('STATE:', JSON.stringify(state, null, 2));
  if(errors.length) console.log('PAGE ERRORS:', JSON.stringify(errors));
  if(logs.length) console.log('CONSOLE ERRORS:', JSON.stringify(logs));
  await browser.close();
})();
