const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
let ok = 0;

// 1. SPEED LINES CSS
if (!html.includes('#speedLines')) {
  // Add CSS
  html = html.replace(
    '#screenFlash{',
    '#speedLines{position:fixed;inset:0;z-index:14;pointer-events:none;opacity:0;transition:opacity .3s;background:repeating-linear-gradient(90deg,transparent 0%,transparent 48%,rgba(255,255,255,0.03) 49%,transparent 50%,transparent 98%,rgba(255,255,255,0.03) 99%,transparent 100%);background-size:20px 100%}\n    #screenFlash{'
  );
  // Add HTML element
  html = html.replace(
    '<div id="screenFlash"></div>',
    '<div id="speedLines"></div>\n<div id="screenFlash"></div>'
  );
  // Add JS in updateHUD
  html = html.replace(
    "document.getElementById('speedVal').textContent=Math.round(spd*500)+'km/h';",
    "document.getElementById('speedVal').textContent=Math.round(spd*500)+'km/h';\n  var _sl=document.getElementById('speedLines');if(_sl)_sl.style.opacity=spd>0.25?String(Math.min(1,(spd-0.25)*4)):'0';"
  );
  ok++;
  console.log('  ✅ Speed lines');
}

// 2. ROUND MINIMAP
if (!html.includes('border-radius:50%')) {
  html = html.replace(
    '#minimap{position:fixed;bottom:15px;left:15px;width:130px;height:130px;z-index:25;',
    '#minimap{position:fixed;bottom:15px;left:15px;width:130px;height:130px;z-index:25;border-radius:50%;'
  );
  ok++;
  console.log('  ✅ Round minimap');
}

fs.writeFileSync('index.html', html);
console.log('Done: ' + ok + ' CSS effects added');
