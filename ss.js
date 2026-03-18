const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({headless:true, args:['--no-sandbox','--disable-gpu','--window-size=1280,720']});
  const page = await browser.newPage();
  await page.setViewport({width:1280, height:720});
  const filePath = 'file:///C:/Users/user/AppData/Local/Temp/impressive-3d-world/index.html';
  await page.goto(filePath, {waitUntil:'load', timeout:15000});
  await new Promise(r=>setTimeout(r,4000));
  await page.mouse.click(640, 480);
  await new Promise(r=>setTimeout(r,2000));
  for(let round=1; round<=3; round++){
    await page.keyboard.down('KeyW');
    await new Promise(r=>setTimeout(r, 7000));
    await page.keyboard.up('KeyW');
    await new Promise(r=>setTimeout(r, 500));
    await page.screenshot({path:'C:/Users/user/AppData/Local/Temp/impressive-3d-world/ss_curve'+round+'.png'});
    console.log('SS'+round+' saved');
  }
  await browser.close();
})();
