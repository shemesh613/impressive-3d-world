const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// ═══════════════════════════════════════
// MAJOR REFACTOR: Road-based choices instead of popup
// The question appears as a HUD banner at top
// Two gates appear on the road - drive through the right one!
// ═══════════════════════════════════════

// 1. Add CSS for road choice HUD banner (non-blocking)
html = html.replace(
  '#scenario .timer-bar{margin-top:14px;height:5px;background:rgba(255,255,255,.1);border-radius:3px;overflow:hidden}',
  `#scenario .timer-bar{margin-top:14px;height:5px;background:rgba(255,255,255,.1);border-radius:3px;overflow:hidden}
    #roadChoice{position:fixed;top:70px;left:50%;transform:translateX(-50%);z-index:35;display:none;
      width:min(94vw,600px);background:rgba(0,10,20,.85);border:2px solid rgba(74,222,128,.3);border-radius:16px;
      padding:14px 20px;text-align:center;backdrop-filter:blur(8px);pointer-events:none;direction:rtl}
    #roadChoice .rc-question{color:#fff;font-size:clamp(15px,3vw,20px);font-weight:700;line-height:1.5;margin-bottom:8px}
    #roadChoice .rc-hint{display:flex;justify-content:center;gap:30px;font-size:clamp(13px,2.5vw,17px);font-weight:700}
    #roadChoice .rc-left{color:#4ade80}
    #roadChoice .rc-right{color:#ef4444}
    #roadChoice .rc-timer{height:3px;background:rgba(255,255,255,.1);border-radius:2px;margin-top:8px;overflow:hidden}
    #roadChoice .rc-timer-fill{height:100%;width:100%;background:#fbbf24;border-radius:2px;transition:width linear}`
);

// 2. Add HTML for road choice banner
html = html.replace(
  '<!-- SCENARIO POPUP -->',
  `<!-- ROAD CHOICE BANNER (non-blocking) -->
<div id="roadChoice">
  <div class="rc-question" id="rcQuestion"></div>
  <div class="rc-hint">
    <span class="rc-left">◄ <span id="rcLeft"></span></span>
    <span class="rc-right"><span id="rcRight"></span> ►</span>
  </div>
  <div class="rc-timer"><div class="rc-timer-fill" id="rcTimerFill"></div></div>
</div>
<!-- SCENARIO POPUP -->`
);

// 3. Add 3D gate meshes after follower cars section
html = html.replace(
  'followerInst.frustumCulled=false;scene.add(followerInst);',
  `followerInst.frustumCulled=false;scene.add(followerInst);

// ---- ROAD CHOICE GATES ----
const gateGeo=new THREE.BoxGeometry(4,3,0.3);
const gateGreenMat=new THREE.MeshStandardMaterial({color:0x22c55e,emissive:0x22c55e,emissiveIntensity:0.5,roughness:0.3,metalness:0.2,transparent:true,opacity:0.7});
const gateRedMat=new THREE.MeshStandardMaterial({color:0xef4444,emissive:0xef4444,emissiveIntensity:0.5,roughness:0.3,metalness:0.2,transparent:true,opacity:0.7});
const gateLMesh=new THREE.Mesh(gateGeo,gateGreenMat);
const gateRMesh=new THREE.Mesh(gateGeo,gateRedMat);
gateLMesh.visible=false;gateRMesh.visible=false;
scene.add(gateLMesh);scene.add(gateRMesh);
// Gate poles
const gatePoleGeo=new THREE.CylinderGeometry(0.08,0.08,4,6);
const gatePoleMat=new THREE.MeshStandardMaterial({color:0x888888,roughness:0.4,metalness:0.6});
const gatePoleL1=new THREE.Mesh(gatePoleGeo,gatePoleMat);
const gatePoleL2=new THREE.Mesh(gatePoleGeo,gatePoleMat);
const gatePoleR1=new THREE.Mesh(gatePoleGeo,gatePoleMat);
const gatePoleR2=new THREE.Mesh(gatePoleGeo,gatePoleMat);
[gatePoleL1,gatePoleL2,gatePoleR1,gatePoleR2].forEach(p=>{p.visible=false;scene.add(p)});
window._gates={lMesh:gateLMesh,rMesh:gateRMesh,poles:[gatePoleL1,gatePoleL2,gatePoleR1,gatePoleR2],active:false,z:0,greenSide:'left',scenarioIdx:-1};`
);

// 4. Replace triggerScenario to use road gates instead of popup
html = html.replace(
  `function triggerScenario(){
  if(scenarioActive||!gameActive)return;
  let available=SCENARIOS.filter((_,i)=>!usedScenarios.includes(i));
  if(available.length===0){usedScenarios=[];available=SCENARIOS}
  const idx=SCENARIOS.indexOf(available[Math.floor(Math.random()*available.length)]);
  usedScenarios.push(idx);
  const s=SCENARIOS[idx];

  scenarioActive=true;
  sfxScenario();
  document.getElementById('situationText').textContent=s.situation;
  // Randomize button positions
  if(Math.random()>.5){
    document.getElementById('choiceGreen').textContent=s.green.text;
    document.getElementById('choiceRed').textContent=s.red.text;
    document.getElementById('choiceGreen').className='choice-btn choice-green';
    document.getElementById('choiceRed').className='choice-btn choice-red';
  } else {
    document.getElementById('choiceGreen').textContent=s.red.text;
    document.getElementById('choiceRed').textContent=s.green.text;
    document.getElementById('choiceGreen').className='choice-btn choice-red';
    document.getElementById('choiceRed').className='choice-btn choice-green';
  }
  document.getElementById('scenario').style.display='block';

  // Timer (8 seconds)
  const tf=document.getElementById('timerFill');
  tf.style.transition='none';tf.style.width='100%';
  requestAnimationFrame(()=>{tf.style.transition='width 12s linear';tf.style.width='0%'});
  scenarioTimeout=setTimeout(()=>{if(scenarioActive)choose('timeout')},20000);
}`,
  `function triggerScenario(){
  if(scenarioActive||!gameActive)return;
  let available=SCENARIOS.filter((_,i)=>!usedScenarios.includes(i));
  if(available.length===0){usedScenarios=[];available=SCENARIOS}
  const idx=SCENARIOS.indexOf(available[Math.floor(Math.random()*available.length)]);
  usedScenarios.push(idx);
  const s=SCENARIOS[idx];

  scenarioActive=true;
  sfxScenario();

  // Road-based choice: spawn gates ahead
  const g=window._gates;
  g.scenarioIdx=idx;
  g.z=car.position.z+50;
  g.greenSide=Math.random()>.5?'left':'right';
  g.active=true;

  const rx=roadX(g.z);
  const hy=roadY(g.z);
  const leftX=rx-3;
  const rightX=rx+3;

  // Position gates
  g.lMesh.position.set(leftX,hy+1.5,g.z);
  g.rMesh.position.set(rightX,hy+1.5,g.z);

  // Assign green/red materials based on randomized side
  if(g.greenSide==='left'){
    g.lMesh.material=gateGreenMat;
    g.rMesh.material=gateRedMat;
  } else {
    g.lMesh.material=gateRedMat;
    g.rMesh.material=gateGreenMat;
  }

  g.lMesh.visible=true;g.rMesh.visible=true;

  // Position poles
  g.poles[0].position.set(leftX-2,hy+2,g.z);g.poles[0].visible=true;
  g.poles[1].position.set(leftX+2,hy+2,g.z);g.poles[1].visible=true;
  g.poles[2].position.set(rightX-2,hy+2,g.z);g.poles[2].visible=true;
  g.poles[3].position.set(rightX+2,hy+2,g.z);g.poles[3].visible=true;

  // Show question in HUD banner (non-blocking!)
  document.getElementById('rcQuestion').textContent=s.situation;
  const leftText=g.greenSide==='left'?s.green.text:s.red.text;
  const rightText=g.greenSide==='right'?s.green.text:s.red.text;
  document.getElementById('rcLeft').textContent=leftText;
  document.getElementById('rcRight').textContent=rightText;
  document.getElementById('roadChoice').style.display='block';

  // Timer bar
  const tf=document.getElementById('rcTimerFill');
  tf.style.transition='none';tf.style.width='100%';
  requestAnimationFrame(()=>{tf.style.transition='width 10s linear';tf.style.width='0%'});
  scenarioTimeout=setTimeout(()=>{if(scenarioActive)resolveRoadChoice('timeout')},15000);
}`
);

// 5. Add road choice resolution (detect which gate player drove through)
// Add before the choose function
html = html.replace(
  'function choose(type){',
  `function resolveRoadChoice(type){
  if(!scenarioActive)return;
  const g=window._gates;
  if(!g.active)return;

  let isGreen=false;
  if(type==='timeout'){
    isGreen=false;
  } else {
    // Check which side the car is on relative to road center
    const rx=roadX(g.z);
    const carSide=car.position.x<rx?'left':'right';
    isGreen=(carSide===g.greenSide);
  }

  scenarioActive=false;
  g.active=false;
  clearTimeout(scenarioTimeout);

  // Hide gates
  g.lMesh.visible=false;g.rMesh.visible=false;
  g.poles.forEach(p=>p.visible=false);
  document.getElementById('roadChoice').style.display='none';

  const idx=g.scenarioIdx;
  const s=SCENARIOS[idx];
  const fb=document.getElementById('feedback');
  const fbIcon=document.getElementById('fbIcon');
  const fbText=document.getElementById('fbText');

  scenariosAnswered++;

  if(isGreen){
    greenCount++;score+=s.green.points;flow=Math.min(100,flow+20);boostTimer=120;streak++;if(streak>bestStreak)bestStreak=streak;lives=Math.min(5,lives+0.5);
    sfxGreen();screenFlash("flash-green");
    emitParticles(car.position.x,2,car.position.z,0x22c55e,12);
    fbIcon.textContent='\\u{1F7E2}';
    fbText.textContent=s.greenFeedback;
    fbText.style.color='#4ade80';
  } else {
    redCount++;score+=s.red.points;streak=0;if(score<0)score=0;flow=Math.max(0,flow-8);spd*=.5;lives=Math.max(0,lives-0.7);
    sfxRed();screenFlash("flash-red");
    emitParticles(car.position.x,2,car.position.z,0xef4444,12);
    fbIcon.textContent='\\u{1F534}';
    fbText.textContent=type==='timeout'?'\\u23F0 לא הספקת לבחור — כולם מחכים...':s.redFeedback;
    fbText.style.color='#f87171';
  }

  fb.style.display='block';
  fb.style.animation='none';
  requestAnimationFrame(()=>{fb.style.animation='feedPop .6s ease'});
  setTimeout(()=>{fb.style.display='none'},2200);

  const tipEl=document.getElementById('tip');
  const tips=['\\u{1F4A1} טיפ: דברים קטנים — לא שווה לריב עליהם!','\\u{1F4A1} טיפ: כשמתגמשים — כולם נהנים יותר!','\\u{1F4A1} טיפ: לפעמים ויתור = ניצחון!','\\u{1F4A1} טיפ: חברים אוהבים מי שזורם!'];
  tipEl.textContent=tips[Math.floor(Math.random()*tips.length)];
  tipEl.style.display='block';setTimeout(()=>{tipEl.style.display='none'},3500);

  if(scenariosAnswered>0&&scenariosAnswered%4===0){
    level++;sfxLevelUp();
    const lu=document.getElementById('levelUp');
    document.getElementById('levelUpText').textContent='שלב '+level+'! \\u{1F389}';
    document.getElementById('levelUpSub').textContent='המצבים נהיים מאתגרים יותר!';
    lu.style.display='flex';setTimeout(()=>{lu.style.display='none'},1500);
  }

  if(flow<=0){
    gameActive=false;
    document.getElementById('finalScore').textContent=score;
    document.getElementById('finalGreen').textContent=greenCount;
    document.getElementById('finalRed').textContent=redCount;
    document.getElementById('finalStreak').textContent=bestStreak;
    const ratio=greenCount/(greenCount+redCount+.001);
    document.getElementById('finalMsg').textContent=ratio>.7?'\\u{1F31F} זורם מדהים! כולם רוצים לנסוע איתך!':ratio>.4?'\\u{1F44D} לא רע! עוד קצת אימון וזורם מושלם!':'\\u{1F4AA} צריך עוד אימון בזרימה — ננסה שוב?';
    document.getElementById('finalDist').textContent=Math.floor(car.position.z);
    document.getElementById('finalStars').textContent=greenCount>redCount*2?'\\u2B50\\u2B50\\u2B50':greenCount>redCount?'\\u2B50\\u2B50':'\\u2B50';
    mpGameOver();document.getElementById('gameOver').style.display='flex';
    return;
  }

  nextScenarioAt=car.position.z+80+Math.random()*60;
}

function choose(type){`
);

// 6. Add gate collision detection in game loop
// Find where triggerScenario is called and add gate detection before it
html = html.replace(
  "if(car.position.z>=nextScenarioAt)triggerScenario();",
  `// Check if player drove through a gate
  if(window._gates&&window._gates.active&&car.position.z>=window._gates.z-1&&car.position.z<=window._gates.z+3){
    resolveRoadChoice('drive');
  }
  // Timeout: if player passed gate zone without triggering
  if(window._gates&&window._gates.active&&car.position.z>window._gates.z+10){
    resolveRoadChoice('timeout');
  }
  if(car.position.z>=nextScenarioAt)triggerScenario();`
);

// 7. Remove keyboard shortcut for old popup choices (no longer needed for scenarios)
// Keep the old choose function but it won't be called for road scenarios
html = html.replace(
  "if(scenarioActive){if(e.code==='Digit1'||e.code==='ArrowRight')choose('green');if(e.code==='Digit2'||e.code==='ArrowLeft')choose('red')}",
  "// Road-based choices - no keyboard shortcuts needed for scenarios"
);

fs.writeFileSync('index.html', html);
console.log('Road-based choices system implemented!');
console.log('  - Questions appear as non-blocking HUD banner');
console.log('  - Two glowing gates on road (green + red)');
console.log('  - Player drives through the correct gate');
console.log('  - No more game-stopping popups!');
