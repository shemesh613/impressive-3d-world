const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// ═══════════════════════════════════════
// 1. PLAYER CAR - rounder hood shape (beveled front)
// ═══════════════════════════════════════
// Add a front bumper and rear bumper to player car
html = html.replace(
  'scene.add(car);',
  `// Car bumpers for rounder look
const bumperGeo=new THREE.BoxGeometry(2.1,0.25,0.3);
const bumperMat=new THREE.MeshStandardMaterial({color:0x111111,roughness:0.7,metalness:0.3});
const frontBumper=new THREE.Mesh(bumperGeo,bumperMat);
frontBumper.position.set(0,0.25,2.15);car.add(frontBumper);
const rearBumper=new THREE.Mesh(bumperGeo,bumperMat);
rearBumper.position.set(0,0.25,-2.15);car.add(rearBumper);
// Side mirrors
const mirrorGeo=new THREE.BoxGeometry(0.15,0.1,0.2);
const mirrorMat=new THREE.MeshStandardMaterial({color:0x22c55e,roughness:0.35,metalness:0.4});
const mirrorL=new THREE.Mesh(mirrorGeo,mirrorMat);
mirrorL.position.set(-1.1,0.85,0.5);car.add(mirrorL);
const mirrorR=new THREE.Mesh(mirrorGeo,mirrorMat);
mirrorR.position.set(1.1,0.85,0.5);car.add(mirrorR);
// Roof rack
const rackGeo=new THREE.BoxGeometry(1.2,0.06,1.8);
const rackMat=new THREE.MeshStandardMaterial({color:0x333333,roughness:0.5,metalness:0.5});
const rack=new THREE.Mesh(rackGeo,rackMat);
rack.position.set(0,1.4,-0.1);car.add(rack);
scene.add(car);`
);

// ═══════════════════════════════════════
// 2. ROAD SURFACE - Add center divider
// ═══════════════════════════════════════
// Add road center double line after road marks section
html = html.replace(
  '// ---- PARKS ----',
  `// ---- CENTER DIVIDER (double yellow) ----
{
  const cdGeo=new THREE.PlaneGeometry(0.08,6);
  const cdMat=new THREE.MeshStandardMaterial({color:0xfbbf24,emissive:0xfbbf24,emissiveIntensity:0.1,roughness:0.5});
  const cdL=new THREE.InstancedMesh(cdGeo,cdMat,300);
  const cdR=new THREE.InstancedMesh(cdGeo,cdMat,300);
  for(let i=0;i<300;i++){
    const _z=-50+i*10;
    dummy.position.set(roadX(_z)-0.15,roadY(_z)+0.035,_z);
    dummy.rotation.set(-Math.PI/2,0,0);dummy.scale.setScalar(1);dummy.updateMatrix();
    cdL.setMatrixAt(i,dummy.matrix);
    dummy.position.set(roadX(_z)+0.15,roadY(_z)+0.035,_z);dummy.updateMatrix();
    cdR.setMatrixAt(i,dummy.matrix);
  }
  cdL.instanceMatrix.needsUpdate=true;cdR.instanceMatrix.needsUpdate=true;
  scene.add(cdL);scene.add(cdR);
}
// ---- PARKS ----`
);

// ═══════════════════════════════════════
// 3. FLOWER BEDS in parks
// ═══════════════════════════════════════
html = html.replace(
  '// ---- PARK BENCHES ----',
  `// ---- FLOWER BEDS in parks ----
{
  const flowerColors=[0xff6b9d,0xfbbf24,0xff4444,0xc084fc,0xf472b6,0x60a5fa];
  const flowerGeo=new THREE.SphereGeometry(0.25,5,4);
  const FLOWER_N=90;
  const flowerInst=new THREE.InstancedMesh(flowerGeo,new THREE.MeshStandardMaterial({roughness:0.7,metalness:0.0}),FLOWER_N);
  flowerInst.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(FLOWER_N*3),3);
  const _fc2=new THREE.Color();
  for(let i=0;i<FLOWER_N;i++){
    const _fz=i*30+25;
    const side=i%2===0?roadX(_fz)-14+Math.random()*3:roadX(_fz)+12+Math.random()*3;
    _fc2.setHex(flowerColors[Math.floor(Math.random()*flowerColors.length)]);
    flowerInst.instanceColor.setXYZ(i,_fc2.r,_fc2.g,_fc2.b);
    dummy.position.set(side,roadY(_fz)+0.3,_fz);
    dummy.scale.setScalar(0.5+Math.random()*0.5);
    dummy.rotation.set(0,0,0);dummy.updateMatrix();
    flowerInst.setMatrixAt(i,dummy.matrix);
  }
  flowerInst.instanceMatrix.needsUpdate=true;flowerInst.instanceColor.needsUpdate=true;
  scene.add(flowerInst);
}
// ---- PARK BENCHES ----`
);

// ═══════════════════════════════════════
// 4. FIRE HYDRANTS on sidewalks
// ═══════════════════════════════════════
html = html.replace(
  '// ---- ROAD SIGNS ----',
  `// ---- FIRE HYDRANTS ----
{
  const FH_N=25;
  const fhBodyGeo=new THREE.CylinderGeometry(0.12,0.15,0.5,6);
  const fhCapGeo=new THREE.SphereGeometry(0.14,6,4);
  const fhMat=new THREE.MeshStandardMaterial({color:0xcc2222,roughness:0.6,metalness:0.2});
  const fhBodyInst=new THREE.InstancedMesh(fhBodyGeo,fhMat,FH_N);
  const fhCapInst=new THREE.InstancedMesh(fhCapGeo,fhMat,FH_N);
  for(let i=0;i<FH_N;i++){
    const z=i*120+50;
    const side=i%2===0?roadX(z)-6.2:roadX(z)+6.2;
    const hy=roadY(z);
    dummy.position.set(side,hy+0.35,z);dummy.scale.setScalar(1);dummy.rotation.set(0,0,0);dummy.updateMatrix();
    fhBodyInst.setMatrixAt(i,dummy.matrix);
    dummy.position.set(side,hy+0.65,z);dummy.updateMatrix();
    fhCapInst.setMatrixAt(i,dummy.matrix);
  }
  fhBodyInst.instanceMatrix.needsUpdate=true;fhCapInst.instanceMatrix.needsUpdate=true;
  scene.add(fhBodyInst);scene.add(fhCapInst);
}
// ---- ROAD SIGNS ----`
);

// ═══════════════════════════════════════
// 5. BETTER PEDESTRIAN CLOTHES (colored bodies)
// ═══════════════════════════════════════
html = html.replace(
  "const pedBodyInst=new THREE.InstancedMesh(pedBodyGeo,new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0x4488cc}),PED_N);",
  "const pedBodyInst=new THREE.InstancedMesh(pedBodyGeo,new THREE.MeshStandardMaterial({roughness:0.7,metalness:0.05,color:0xffffff}),PED_N);\n  pedBodyInst.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(PED_N*3),3);\n  const shirtColors=[0x4488cc,0xcc4444,0x44cc88,0xcccc44,0xcc44cc,0xff8844,0x4466aa,0x886644];\n  const _shc=new THREE.Color();"
);

// Add shirt color assignment in pedestrian loop
html = html.replace(
  "pedHeadInst.instanceColor.setXYZ(i,_pedc.r,_pedc.g,_pedc.b);",
  "pedHeadInst.instanceColor.setXYZ(i,_pedc.r,_pedc.g,_pedc.b);\n    _shc.setHex(shirtColors[Math.floor(Math.random()*shirtColors.length)]);\n    pedBodyInst.instanceColor.setXYZ(i,_shc.r,_shc.g,_shc.b);"
);

// Update the needsUpdate for body colors
html = html.replace(
  "pedBodyInst.instanceMatrix.needsUpdate=true;\n  pedHeadInst.instanceMatrix.needsUpdate=true;\n  pedHeadInst.instanceColor.needsUpdate=true;",
  "pedBodyInst.instanceMatrix.needsUpdate=true;\n  if(pedBodyInst.instanceColor)pedBodyInst.instanceColor.needsUpdate=true;\n  pedHeadInst.instanceMatrix.needsUpdate=true;\n  pedHeadInst.instanceColor.needsUpdate=true;"
);

fs.writeFileSync('index.html', html);
console.log('Art polish applied!');
console.log('  - Car: bumpers, side mirrors, roof rack');
console.log('  - Road: center double yellow divider');
console.log('  - Parks: colorful flower beds');
console.log('  - Sidewalks: red fire hydrants');
console.log('  - Pedestrians: varied shirt colors');
