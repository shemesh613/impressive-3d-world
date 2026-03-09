const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({headless:'new',args:['--no-sandbox','--disable-gpu']});
  const page = await browser.newPage();
  await page.setViewport({width:1280,height:720});
  await page.goto('file:///tmp/impressive-3d-world/index.html',{waitUntil:'networkidle2',timeout:15000});
  await page.screenshot({path:'/tmp/screen_start.png'});
  
  // Check for JS errors
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  
  // Click play button
  await page.click('#playBtn').catch(()=>{});
  await new Promise(r=>setTimeout(r,3000));
  await page.screenshot({path:'/tmp/screen_game.png'});
  
  // Press ArrowUp for a few seconds to drive
  await page.keyboard.down('ArrowUp');
  await new Promise(r=>setTimeout(r,4000));
  await page.keyboard.up('ArrowUp');
  await page.screenshot({path:'/tmp/screen_driving.png'});
  
  // Check DOM state
  const state = await page.evaluate(() => {
    return {
      startVisible: document.getElementById('startScreen')?.style.display,
      hudVisible: document.getElementById('hud')?.style.display,
      score: document.getElementById('scoreVal')?.textContent,
      dist: document.getElementById('distVal')?.textContent,
      greensCount: typeof greens !== 'undefined' ? greens.length : 'N/A',
      obsCount: typeof obstacles !== 'undefined' ? obstacles.length : 'N/A',
      carZ: typeof car !== 'undefined' ? Math.floor(car.position.z) : 'N/A',
      errors: typeof window._jsErrors !== 'undefined' ? window._jsErrors : []
    };
  });
  console.log('STATE:', JSON.stringify(state));
  if(errors.length) console.log('ERRORS:', errors.join('; '));
  
  await browser.close();
})();
