const puppeteer = require('puppeteer');
(async()=>{
  const b = await puppeteer.launch({headless:'new',args:['--no-sandbox']});
  const p = await b.newPage();
  await p.setViewport({width:1280,height:720});
  await p.goto('https://shemesh613.github.io/impressive-3d-world/', {waitUntil:'networkidle2',timeout:30000});
  await new Promise(r=>setTimeout(r,2000));
  // Click play
  await p.click('#playBtn').catch(()=>{});
  await new Promise(r=>setTimeout(r,1000));
  // Press W to drive
  await p.keyboard.down('KeyW');
  await new Promise(r=>setTimeout(r,4000));
  await p.keyboard.up('KeyW');
  await new Promise(r=>setTimeout(r,500));
  await p.screenshot({path:'/tmp/impressive-3d-world/ss_hills.png'});
  console.log('Screenshot saved');
  await b.close();
})();
