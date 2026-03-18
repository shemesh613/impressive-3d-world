const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
let ok = 0;

function safe(name, old, rep) {
  if (html.includes(old)) { html = html.replace(old, rep); ok++; console.log('  ✅ ' + name); }
  else { console.log('  ⏭️ ' + name + ' (already done or not found)'); }
}

console.log('=== POLISH (no new objects) ===\n');

// ═══════════════════════════════════
// 1. HUD - cleaner lives display
// ═══════════════════════════════════
safe('Lives dots',
  "document.getElementById('livesVal').textContent='🧒'.repeat(friendsN)+(lives<5?' 😢'.repeat(5-friendsN):'');",
  "document.getElementById('livesVal').innerHTML='<span style=\"color:#4ade80\">'+('●').repeat(friendsN)+'</span>'+(lives<5?'<span style=\"color:#444\">'+('●').repeat(5-friendsN)+'</span>':'');"
);

safe('Lives font',
  "#livesVal{color:#60a5fa;font-size:13px}",
  "#livesVal{color:#4ade80;font-size:17px;letter-spacing:3px}"
);

safe('Flow bar wider',
  "#flowBar{width:130px;height:14px;",
  "#flowBar{width:155px;height:15px;"
);

// ═══════════════════════════════════
// 2. HUD items - subtle glow
// ═══════════════════════════════════
safe('HUD item style',
  ".hud-item{background:rgba(0,0,20,.75);border-radius:15px;padding:8px 16px;display:flex;align-items:center;gap:6px;",
  ".hud-item{background:rgba(0,8,16,.85);border-radius:12px;padding:8px 16px;display:flex;align-items:center;gap:6px;box-shadow:0 2px 8px rgba(0,0,0,0.3);"
);

// ═══════════════════════════════════
// 3. EXISTING CAR - better materials
// ═══════════════════════════════════
safe('Car body metallic',
  "const body=new THREE.Mesh(new THREE.BoxGeometry(2,.7,4),new THREE.MeshStandardMaterial({color:0x22c55e,roughness:0.35,metalness:0.4}));",
  "const body=new THREE.Mesh(new THREE.BoxGeometry(2,.7,4),new THREE.MeshStandardMaterial({color:0x22c55e,roughness:0.28,metalness:0.5}));"
);

safe('Car cabin glass',
  "const cabin=new THREE.Mesh(new THREE.BoxGeometry(1.6,.5,2.2),new THREE.MeshStandardMaterial({color:0x0a5c2e,roughness:0.2,metalness:0.6}));",
  "const cabin=new THREE.Mesh(new THREE.BoxGeometry(1.6,.5,2.2),new THREE.MeshStandardMaterial({color:0x0a4a28,roughness:0.1,metalness:0.7}));"
);

// ═══════════════════════════════════
// 4. EXISTING TREES - better colors (random)
// ═══════════════════════════════════
safe('Tree color random',
  "leafInst.setColorAt(i,_col.setHex(leafColors[i%leafColors.length]));",
  "leafInst.setColorAt(i,_col.setHex(leafColors[Math.floor(Math.random()*leafColors.length)]));"
);

safe('More tree colors',
  "const leafColors=[0x16a34a,0x22c55e,0x15803d,0x4ade80,0x86efac];",
  "const leafColors=[0x16a34a,0x22c55e,0x15803d,0xd4a030,0xc05020,0x2d8a4e,0x1a6a3a,0x6aaa3a];"
);

// ═══════════════════════════════════
// 5. EXISTING ROAD - wet reflective
// ═══════════════════════════════════
safe('Wet road',
  "new THREE.PlaneGeometry(11,SLEN),new THREE.MeshStandardMaterial({color:0x2a3050,roughness:0.85,metalness:0.1})",
  "new THREE.PlaneGeometry(11,SLEN),new THREE.MeshStandardMaterial({color:0x2a3050,roughness:0.5,metalness:0.25})"
);

// ═══════════════════════════════════
// 6. EXISTING ROAD EDGES - brighter glow
// ═══════════════════════════════════
safe('Road edge glow',
  "const edgeMat=new THREE.MeshStandardMaterial({color:0x22c55e,emissive:0x22c55e,emissiveIntensity:0.4,roughness:0.5,metalness:0.1});",
  "const edgeMat=new THREE.MeshStandardMaterial({color:0x22c55e,emissive:0x22c55e,emissiveIntensity:0.65,roughness:0.3,metalness:0.1});"
);

// ═══════════════════════════════════
// 7. WINDOWS - brighter glow on existing
// ═══════════════════════════════════
safe('Window glow',
  "const mat=new THREE.MeshStandardMaterial({color:0xffeecc,emissive:0xffdd88,emissiveIntensity:0.6,roughness:0.2,metalness:0.0});",
  "const mat=new THREE.MeshStandardMaterial({color:0xffeebb,emissive:0xffcc55,emissiveIntensity:1.0,roughness:0.1,metalness:0.0});"
);

// ═══════════════════════════════════
// 8. EXISTING LAMP - bigger glow
// ═══════════════════════════════════
safe('Bigger lamp glow',
  "const glowGeo=new THREE.SphereGeometry(.25,4,4);",
  "const glowGeo=new THREE.SphereGeometry(.35,5,5);"
);

// ═══════════════════════════════════
// 9. EXISTING SIDEWALK - gray for contrast
// ═══════════════════════════════════
safe('Gray sidewalks',
  "const swMat=new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0x2a6a4e});",
  "const swMat=new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0x4a5a6a});"
);

// ═══════════════════════════════════
// 10. CHOICE BUTTONS - satisfying press
// ═══════════════════════════════════
safe('Button press feel',
  ".choice-btn:active{transform:scale(.95)}",
  ".choice-btn:active{transform:scale(.92);filter:brightness(1.15)}"
);

// ═══════════════════════════════════
// 11. GAME OVER - more dramatic
// ═══════════════════════════════════
safe('Epic game over',
  "#gameOver h2{font-size:clamp(36px,7vw,60px);color:#4ade80;margin-bottom:10px;text-shadow:0 0 20px rgba(74,222,128,.5)}",
  "#gameOver h2{font-size:clamp(36px,7vw,60px);color:#4ade80;margin-bottom:10px;text-shadow:0 0 30px rgba(74,222,128,.6),0 0 60px rgba(74,222,128,.2)}"
);

// ═══════════════════════════════════
// 12. MOBILE CONTROLS - bigger targets
// ═══════════════════════════════════
safe('Bigger mobile buttons',
  ".ctrl-btn{width:clamp(50px,12vw,70px);height:clamp(50px,12vw,70px);",
  ".ctrl-btn{width:clamp(56px,14vw,76px);height:clamp(56px,14vw,76px);"
);

// ═══════════════════════════════════
// 13. SHOP COLORS - better palette
// ═══════════════════════════════════
safe('Shop palette',
  "const shopColors=[0xff3366,0x33ccff,0xffcc00,0x66ff33,0xff6600,0xcc33ff,0x00ffcc,0xff3399];",
  "const shopColors=[0xe63946,0x457b9d,0xf4a261,0x2a9d8f,0xe76f51,0x6d6875,0x48cae4,0xf72585];"
);

// ═══════════════════════════════════
// 14. LANE MARKS - subtle glow
// ═══════════════════════════════════
safe('Lane mark glow',
  "const m=new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0xfbbf24});",
  "const m=new THREE.MeshStandardMaterial({color:0xfbbf24,emissive:0xfbbf24,emissiveIntensity:0.12,roughness:0.5,metalness:0.0});"
);

// ═══════════════════════════════════
// 15. FOLLOWER CARS - metallic
// ═══════════════════════════════════
safe('Follower cars metallic',
  "const followerInst=new THREE.InstancedMesh(new THREE.BoxGeometry(1.6,.5,3),new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05}),FOLLOWER_N);",
  "const followerInst=new THREE.InstancedMesh(new THREE.BoxGeometry(1.6,.5,3),new THREE.MeshStandardMaterial({roughness:0.35,metalness:0.4}),FOLLOWER_N);"
);

fs.writeFileSync('index.html', html);
console.log('\n=== DONE: ' + ok + ' changes ===');
