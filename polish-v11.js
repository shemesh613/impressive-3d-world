const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// ═══════════════════════════════════════
// 1. START SCREEN - Premium gaming feel
// ═══════════════════════════════════════
// Better background with subtle pattern
html = html.replace(
  "background:radial-gradient(ellipse at 50% 30%,#0d2818 0%,#040d08 60%,#000 100%)",
  "background:radial-gradient(ellipse at 50% 20%,#0d2818 0%,#040d08 50%,#000804 100%)"
);

// Title - add letter spacing for premium feel
html = html.replace(
  "#startScreen h1{font-size:clamp(36px,8vw,72px);color:#4ade80;",
  "#startScreen h1{font-size:clamp(36px,8vw,72px);color:#4ade80;letter-spacing:4px;"
);

// Instructions box - glassmorphism
html = html.replace(
  "#startScreen .instructions{background:rgba(255,255,255,.08);border:1px solid rgba(74,222,128,.2);border-radius:20px;",
  "#startScreen .instructions{background:rgba(255,255,255,.06);border:1px solid rgba(74,222,128,.15);border-radius:20px;backdrop-filter:blur(8px);"
);

// ═══════════════════════════════════════
// 2. GAME OVER - More dramatic stats layout
// ═══════════════════════════════════════
html = html.replace(
  "#gameOver{position:fixed;inset:0;z-index:60;display:none;align-items:center;justify-content:center;flex-direction:column;\n      background:rgba(0,0,0,.88);backdrop-filter:blur(12px)}",
  "#gameOver{position:fixed;inset:0;z-index:60;display:none;align-items:center;justify-content:center;flex-direction:column;background:rgba(0,0,0,.92);backdrop-filter:blur(16px)}"
);

// ═══════════════════════════════════════
// 3. GREEN COLLECTIBLES - More visible, sparkling
// ═══════════════════════════════════════
html = html.replace(
  "const greenGeo=new THREE.OctahedronGeometry(.7,1);",
  "const greenGeo=new THREE.OctahedronGeometry(.8,1);"
);

// ═══════════════════════════════════════
// 4. SCREEN FLASH - smoother transitions
// ═══════════════════════════════════════
html = html.replace(
  "#screenFlash{position:fixed;inset:0;z-index:15;pointer-events:none;opacity:0;transition:opacity .15s}",
  "#screenFlash{position:fixed;inset:0;z-index:15;pointer-events:none;opacity:0;transition:opacity .1s}"
);

// ═══════════════════════════════════════
// 5. MINIMAP - better visibility
// ═══════════════════════════════════════
html = html.replace(
  "#minimap{position:fixed;bottom:15px;left:15px;width:120px;height:120px;z-index:25;",
  "#minimap{position:fixed;bottom:15px;left:15px;width:130px;height:130px;z-index:25;"
);

// ═══════════════════════════════════════
// 6. CLOUD COLOR - blue-gray instead of green-ish
// ═══════════════════════════════════════
html = html.replace(
  "const cloudMat=new THREE.MeshBasicMaterial({color:0x1a3a2a,transparent:true,opacity:.4});",
  "const cloudMat=new THREE.MeshBasicMaterial({color:0x1a2a3a,transparent:true,opacity:.3});"
);

// ═══════════════════════════════════════
// 7. ROAD MARKS - slightly brighter lane lines
// ═══════════════════════════════════════
html = html.replace(
  "const m=new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0xfbbf24});",
  "const m=new THREE.MeshStandardMaterial({color:0xfbbf24,emissive:0xfbbf24,emissiveIntensity:0.15,roughness:0.5,metalness:0.0});"
);

// ═══════════════════════════════════════
// 8. TIP TEXT - gaming style
// ═══════════════════════════════════════
html = html.replace(
  "#tip{position:fixed;bottom:50px;left:50%;",
  "#tip{position:fixed;bottom:55px;left:50%;"
);

fs.writeFileSync('index.html', html);
console.log('Polish v11 applied - start screen, game over, collectibles, minimap, clouds, lanes');
