const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// ═══════════════════════════════════════
// 1. FIX ROAD HILLS - gentler slopes, no deep drops
// ═══════════════════════════════════════
html = html.replace(
  "function roadY(z){return Math.sin(z*.012)*3+Math.sin(z*.025)*1.5}",
  "function roadY(z){return Math.sin(z*.008)*2+Math.sin(z*.018)*1}"
);

// Raise ground plane so no black gaps on descents
html = html.replace(
  "new THREE.PlaneGeometry(400,6000),new THREE.MeshStandardMaterial({color:0x0f1e30,roughness:0.95,metalness:0.05})",
  "new THREE.PlaneGeometry(400,6000),new THREE.MeshStandardMaterial({color:0x0f1e30,roughness:0.95,metalness:0.05})"
);
// Move ground up from -5 to -2
html = html.replace(
  "m.rotation.x=-Math.PI/2;m.position.y=-5;",
  "m.rotation.x=-Math.PI/2;m.position.y=-2;"
);

// ═══════════════════════════════════════
// 2. FASTER MAX SPEED + more acceleration
// ═══════════════════════════════════════
html = html.replace(
  "const maxSpd=turboTimer>0?.5:boostTimer>0?.4:.28;",
  "const maxSpd=turboTimer>0?.65:boostTimer>0?.5:.35;"
);
html = html.replace(
  "if(keys.ArrowUp||keys.KeyW)spd=Math.min(maxSpd,spd+.014);",
  "if(keys.ArrowUp||keys.KeyW)spd=Math.min(maxSpd,spd+.018);"
);

// ═══════════════════════════════════════
// 3. SHARPER ROAD CURVES for challenge
// ═══════════════════════════════════════
html = html.replace(
  "const base=Math.sin(z*.004)*10+Math.sin(z*.013)*6;",
  "const base=Math.sin(z*.005)*12+Math.sin(z*.015)*8;"
);
html = html.replace(
  "const sharp=(s<120)?0:(s<200)?((s-120)/80)*28:(s<350)?28-((s-200)/150)*56:(s<450)?-28+((s-350)/100)*28:0;",
  "const sharp=(s<120)?0:(s<200)?((s-120)/80)*35:(s<350)?35-((s-200)/150)*70:(s<450)?-35+((s-350)/100)*35:0;"
);

// ═══════════════════════════════════════
// 4. ADD SCENERY - Electric poles along road
// ═══════════════════════════════════════
// Add after street lamps section - find the closing of street lamps
html = html.replace(
  "poleInst.instanceMatrix.needsUpdate=true;glowInst.instanceMatrix.needsUpdate=true;  scene.add(poleInst);scene.add(glowInst);}",
  `poleInst.instanceMatrix.needsUpdate=true;glowInst.instanceMatrix.needsUpdate=true;  scene.add(poleInst);scene.add(glowInst);}
// ---- ELECTRIC POLES WITH WIRES ----
{
  const EP_N=40;
  const epPoleGeo=new THREE.CylinderGeometry(0.05,0.08,6,4);
  const epPoleMat=new THREE.MeshStandardMaterial({color:0x555555,roughness:0.5,metalness:0.6});
  const epPoleInst=new THREE.InstancedMesh(epPoleGeo,epPoleMat,EP_N);
  const epArmGeo=new THREE.BoxGeometry(2,0.06,0.06);
  const epArmMat=new THREE.MeshStandardMaterial({color:0x444444,roughness:0.5,metalness:0.6});
  const epArmInst=new THREE.InstancedMesh(epArmGeo,epArmMat,EP_N);
  for(let i=0;i<EP_N;i++){
    const z=i*75+20;
    const side=roadX(z)+(i%2===0?-12:12);
    const hy=roadY(z);
    dummy.position.set(side,hy+3,z);dummy.scale.setScalar(1);dummy.rotation.set(0,0,0);dummy.updateMatrix();
    epPoleInst.setMatrixAt(i,dummy.matrix);
    dummy.position.set(side,hy+6.2,z);dummy.updateMatrix();
    epArmInst.setMatrixAt(i,dummy.matrix);
  }
  epPoleInst.instanceMatrix.needsUpdate=true;epArmInst.instanceMatrix.needsUpdate=true;
  scene.add(epPoleInst);scene.add(epArmInst);
}
// ---- ROAD FENCES/GUARDRAILS ----
{
  const FENCE_N=80;
  const fencePostGeo=new THREE.BoxGeometry(0.08,0.8,0.08);
  const fenceRailGeo=new THREE.BoxGeometry(0.04,0.04,4);
  const fenceMat=new THREE.MeshStandardMaterial({color:0x888899,roughness:0.5,metalness:0.5});
  const fencePostInst=new THREE.InstancedMesh(fencePostGeo,fenceMat,FENCE_N);
  const fenceRailInst=new THREE.InstancedMesh(fenceRailGeo,fenceMat,FENCE_N);
  for(let i=0;i<FENCE_N;i++){
    const z=i*40+10;
    const rx=roadX(z);
    const side=i%2===0?rx-6.5:rx+6.5;
    const hy=roadY(z);
    dummy.position.set(side,hy+0.5,z);dummy.scale.setScalar(1);dummy.rotation.set(0,0,0);dummy.updateMatrix();
    fencePostInst.setMatrixAt(i,dummy.matrix);
    dummy.position.set(side,hy+0.8,z);dummy.updateMatrix();
    fenceRailInst.setMatrixAt(i,dummy.matrix);
  }
  fencePostInst.instanceMatrix.needsUpdate=true;fenceRailInst.instanceMatrix.needsUpdate=true;
  scene.add(fencePostInst);scene.add(fenceRailInst);
}
// ---- BILLBOARDS (advertising signs) ----
{
  const BB_N=12;
  const bbPoleGeo=new THREE.CylinderGeometry(0.1,0.12,8,4);
  const bbPoleMat=new THREE.MeshStandardMaterial({color:0x666666,roughness:0.4,metalness:0.7});
  const bbPoleInst=new THREE.InstancedMesh(bbPoleGeo,bbPoleMat,BB_N);
  const bbBoardGeo=new THREE.BoxGeometry(4,2.5,0.15);
  const bbBoardMat=new THREE.MeshStandardMaterial({color:0xffffff,roughness:0.6,metalness:0.1});
  const bbBoardInst=new THREE.InstancedMesh(bbBoardGeo,bbBoardMat,BB_N);
  bbBoardInst.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(BB_N*3),3);
  const bbColors=[0x2563eb,0x059669,0xd97706,0x7c3aed,0xdc2626,0x0891b2];
  const _bbc=new THREE.Color();
  for(let i=0;i<BB_N;i++){
    const z=i*250+100;
    const side=roadX(z)+(i%2===0?-16:16);
    const hy=roadY(z);
    _bbc.setHex(bbColors[i%bbColors.length]);
    bbBoardInst.instanceColor.setXYZ(i,_bbc.r,_bbc.g,_bbc.b);
    dummy.position.set(side,hy+4,z);dummy.scale.setScalar(1);dummy.rotation.set(0,0,0);dummy.updateMatrix();
    bbPoleInst.setMatrixAt(i,dummy.matrix);
    dummy.position.set(side,hy+9,z);dummy.rotation.set(0,i%2===0?0.3:-0.3,0);dummy.updateMatrix();
    bbBoardInst.setMatrixAt(i,dummy.matrix);
  }
  bbPoleInst.instanceMatrix.needsUpdate=true;bbBoardInst.instanceMatrix.needsUpdate=true;
  bbBoardInst.instanceColor.needsUpdate=true;
  scene.add(bbPoleInst);scene.add(bbBoardInst);
}`
);

// ═══════════════════════════════════════
// 5. ROAD SEGMENTS - extend for longer visibility
// ═══════════════════════════════════════
html = html.replace(
  "const RSEGS=550,SLEN=6;",
  "const RSEGS=650,SLEN=6;"
);

fs.writeFileSync('index.html', html);
console.log('Hills + speed + curves + scenery upgrade done!');
