const puppeteer = require('puppeteer');
const path = require('path');
(async () => {
  const browser = await puppeteer.launch({headless:'new',args:['--no-sandbox','--disable-gpu']});
  const page = await browser.newPage();
  await page.setViewport({width:1280,height:720});
  const filePath = path.resolve('index.html').split(path.sep).join('/');
  const url = 'file:///' + filePath;
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(url, {waitUntil:'networkidle2',timeout:15000});
  await new Promise(r=>setTimeout(r,3000));
  console.log('PAGE ERRORS:', JSON.stringify(errors));
  await page.screenshot({path:'screen_check.png'});
  await browser.close();
})();
