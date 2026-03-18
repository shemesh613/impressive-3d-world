const puppeteer = require('puppeteer');
(async()=>{
  const b = await puppeteer.launch({headless:'new',args:['--no-sandbox']});
  const p = await b.newPage();
  const errors = [];
  p.on('console', msg => { if(msg.type()==='error') errors.push(msg.text()); });
  p.on('pageerror', err => errors.push(err.message));
  await p.setViewport({width:1280,height:720});
  await p.goto('https://shemesh613.github.io/impressive-3d-world/', {waitUntil:'networkidle2',timeout:30000});
  await new Promise(r=>setTimeout(r,2000));
  await p.click('#playBtn').catch(()=>{});
  await new Promise(r=>setTimeout(r,3000));
  console.log('Errors:', errors.length ? errors.join('\n') : 'None');
  // Check car position
  const pos = await p.evaluate(()=>{
    return {
      x: car?.position?.x,
      y: car?.position?.y,
      z: car?.position?.z,
      gameActive: typeof gameActive !== 'undefined' ? gameActive : 'undef'
    };
  });
  console.log('Car position:', JSON.stringify(pos));
  await b.close();
})();
