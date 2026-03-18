const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// ═══════════════════════════════════════
// 1. FIX HILLS/DESCENT - increase camera far + softer fog
// ═══════════════════════════════════════
html = html.replace(
  "const cam=new THREE.PerspectiveCamera(65,innerWidth/innerHeight,1,400);",
  "const cam=new THREE.PerspectiveCamera(65,innerWidth/innerHeight,0.5,600);"
);
html = html.replace(
  "scene.fog=new THREE.FogExp2(0x0a1628,.0010);",
  "scene.fog=new THREE.FogExp2(0x0a1628,.0008);"
);

// 2. WINDOWS - Reduce count (too many), but make them prettier
// Less windows but better placed
html = html.replace(
  "if(Math.random()>.2)wp.push(b[0]+x*.8,y*1.2+1.2,b[1]+b[4]/2+.01)",
  "if(Math.random()>.45)wp.push(b[0]+x*.9,y*1.5+1.5,b[1]+b[4]/2+.06)"
);
// Smaller, squarer windows (more realistic)
html = html.replace(
  "const n=wp.length/3;const geo=new THREE.PlaneGeometry(.55,.7);",
  "const n=wp.length/3;const geo=new THREE.PlaneGeometry(.4,.5);"
);
// Slightly less intense glow
html = html.replace(
  "const mat=new THREE.MeshStandardMaterial({color:0xffeeaa,emissive:0xffcc44,emissiveIntensity:2.0,roughness:0.05,metalness:0.0});",
  "const mat=new THREE.MeshStandardMaterial({color:0xffeebb,emissive:0xffcc55,emissiveIntensity:1.0,roughness:0.1,metalness:0.0});"
);

// 3. OBSTACLES - Better design (octahedron + warning glow instead of ugly red box)
html = html.replace(
  "const obsInst=new THREE.InstancedMesh(new THREE.BoxGeometry(2,2,2),new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0xff2222,transparent:true,opacity:0.9}),MAX_OBS);",
  "const obsInst=new THREE.InstancedMesh(new THREE.OctahedronGeometry(1.2,0),new THREE.MeshStandardMaterial({color:0xff3333,emissive:0xff1111,emissiveIntensity:0.6,roughness:0.3,metalness:0.2,transparent:true,opacity:0.9}),MAX_OBS);"
);
// Better warning ring
html = html.replace(
  "const obsRingMat=new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0xff4444,transparent:true,opacity:0.4,side:THREE.DoubleSide});",
  "const obsRingMat=new THREE.MeshBasicMaterial({color:0xff4444,transparent:true,opacity:0.25,side:THREE.DoubleSide});"
);

// 4. LIVES/FRIENDS - Better HUD display
// Replace emoji-based lives with clearer visual
html = html.replace(
  "document.getElementById('livesVal').textContent='🧒'.repeat(friendsN)+(lives<5?' 😢'.repeat(5-friendsN):'');",
  "document.getElementById('livesVal').innerHTML='<span style=\"color:#4ade80\">'+('●').repeat(friendsN)+'</span>'+(lives<5?'<span style=\"color:#333\">'+('●').repeat(5-friendsN)+'</span>':'');"
);
// Better followers text
html = html.replace(
  "if(fEl)fEl.textContent='🚗'.repeat(friendsN)+(friendsN>=5?' חברים נוסעים אחריך!':friendsN>0?' '+friendsN+' חברים נשארו... שמרו עליהם!':' 😢 אין חברים... נסו שוב!');",
  "if(fEl)fEl.innerHTML=friendsN>=5?'<span style=\"color:#4ade80\">●●●●●</span> 5 חברים נוסעים אחריך!':friendsN>0?'<span style=\"color:#fbbf24\">'+('●').repeat(friendsN)+'</span> '+friendsN+' חברים נשארו':'<span style=\"color:#ef4444\">אין חברים...</span>';"
);

// 5. HUD STYLE - Cleaner, more gaming-like
html = html.replace(
  "#livesVal{color:#60a5fa;font-size:13px}",
  "#livesVal{color:#60a5fa;font-size:16px;letter-spacing:3px}"
);

// 6. FOLLOWERS display - cleaner bar
html = html.replace(
  "#followers{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:20;pointer-events:none;",
  "#followers{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:20;pointer-events:none;font-size:14px;letter-spacing:1px;"
);

// 7. FOLLOWER CARS - give them metallic look like player
html = html.replace(
  "const followerInst=new THREE.InstancedMesh(new THREE.BoxGeometry(1.6,.5,3),new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05}),FOLLOWER_N);",
  "const followerInst=new THREE.InstancedMesh(new THREE.BoxGeometry(1.6,.5,3),new THREE.MeshStandardMaterial({roughness:0.35,metalness:0.4}),FOLLOWER_N);"
);

// 8. BARRIERS - Better look (rounded warning blocks with stripes feel)
html = html.replace(
  "const barrierGeo=new THREE.BoxGeometry(3,.8,1);",
  "const barrierGeo=new THREE.BoxGeometry(3,.6,.8);"
);

// 9. GROUND PLANE - less dark, slight blue tint
html = html.replace(
  "new THREE.PlaneGeometry(400,6000),new THREE.MeshStandardMaterial({color:0x0d1a2d,roughness:1.0,metalness:0.0})",
  "new THREE.PlaneGeometry(400,6000),new THREE.MeshStandardMaterial({color:0x0f1e30,roughness:0.95,metalness:0.05})"
);

// 10. POWERUP - more visible, golden glow
html = html.replace(
  "const powerupInst=new THREE.InstancedMesh(new THREE.OctahedronGeometry(.8,1),new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0xfbbf24}),MAX_POWERUPS);",
  "const powerupInst=new THREE.InstancedMesh(new THREE.OctahedronGeometry(.8,1),new THREE.MeshStandardMaterial({color:0xfbbf24,emissive:0xffaa00,emissiveIntensity:0.5,roughness:0.2,metalness:0.5}),MAX_POWERUPS);"
);

// 11. SPEED BUMP - sleeker look
html = html.replace(
  "const bumpGeo=new THREE.CylinderGeometry(3,.01,.3,8);",
  "const bumpGeo=new THREE.CylinderGeometry(2.5,.5,.2,12);"
);

// 12. SCENARIO POPUP - more polished gaming feel
html = html.replace(
  "#scenario .situation{color:#fff;font-size:clamp(17px,3.5vw,24px);font-weight:700;margin-bottom:18px;line-height:1.5;direction:rtl}",
  "#scenario .situation{color:#fff;font-size:clamp(17px,3.5vw,22px);font-weight:700;margin-bottom:18px;line-height:1.6;direction:rtl;text-shadow:0 1px 4px rgba(0,0,0,0.3)}"
);

// 13. GAME OVER SCREEN - more dramatic
html = html.replace(
  "#gameOver h2{font-size:clamp(36px,7vw,60px);color:#4ade80;margin-bottom:10px;text-shadow:0 0 20px rgba(74,222,128,.5)}",
  "#gameOver h2{font-size:clamp(36px,7vw,60px);color:#4ade80;margin-bottom:10px;text-shadow:0 0 30px rgba(74,222,128,.6),0 0 60px rgba(74,222,128,.2)}"
);

// 14. CHOICE BUTTONS - more satisfying click feel
html = html.replace(
  ".choice-btn:active{transform:scale(.95)}",
  ".choice-btn:active{transform:scale(.92);filter:brightness(1.2)}"
);

// 15. LEVEL UP - more epic
html = html.replace(
  "#levelUp h2{font-size:clamp(36px,7vw,60px);color:#4ade80;text-shadow:0 0 25px rgba(74,222,128,.5)}",
  "#levelUp h2{font-size:clamp(36px,7vw,60px);color:#4ade80;text-shadow:0 0 30px rgba(74,222,128,.7),0 0 80px rgba(74,222,128,.3)}"
);

// 16. MOBILE CONTROLS - better touch targets
html = html.replace(
  ".ctrl-btn{width:clamp(50px,12vw,70px);height:clamp(50px,12vw,70px);",
  ".ctrl-btn{width:clamp(56px,14vw,76px);height:clamp(56px,14vw,76px);"
);

// 17. HUD ITEMS - slight glow effect
html = html.replace(
  ".hud-item{background:rgba(0,8,16,.85);border-radius:10px;padding:6px 14px;",
  ".hud-item{background:rgba(0,8,16,.88);border-radius:10px;padding:7px 15px;box-shadow:0 2px 10px rgba(0,0,0,0.3);"
);

// 18. FLOW BAR - wider for readability
html = html.replace(
  "#flowBar{width:130px;height:14px;",
  "#flowBar{width:160px;height:16px;"
);

fs.writeFileSync('index.html', html);
console.log('Gaming-level upgrade applied!');
