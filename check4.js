const puppeteer = require('puppeteer');
(async()=>{
  const b = await puppeteer.launch({headless:'new',args:['--no-sandbox','--disable-web-security']});
  const p = await b.newPage();
  await p.setCacheEnabled(false);
  const errors = [];
  p.on('pageerror', err => errors.push(err.message));
  await p.setViewport({width:1280,height:720});
  await p.goto('https://shemesh613.github.io/impressive-3d-world/?v='+Date.now(), {waitUntil:'networkidle2',timeout:30000});
  await new Promise(r=>setTimeout(r,3000));
  if(errors.length) { console.log('INIT ERRORS:', errors.slice(0,3).join('\n')); }
  await p.click('#playBtn').catch(()=>{});
  await new Promise(r=>setTimeout(r,1000));
  await p.keyboard.down('KeyW');
  await new Promise(r=>setTimeout(r,8000));
  await p.screenshot({path:'/tmp/impressive-3d-world/ss_hills4.png'});
  await p.keyboard.up('KeyW');
  console.log('Errors after play:', errors.length);
  const pos = await p.evaluate(()=>({z:Math.floor(car.position.z),y:car.position.y.toFixed(2),active:gameActive}));
  console.log('Car:', JSON.stringify(pos));
  await b.close();
})();
