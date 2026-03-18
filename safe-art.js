const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
let changes = 0;

// ═══════════════════════════════════════
// 1. PLAYER CAR - bumpers, mirrors, roof rack (pure visual, no logic)
// ═══════════════════════════════════════
const carOld = 'scene.add(car);';
const carNew = `// Car detail: bumpers, mirrors, roof rack
const _bpGeo=new THREE.BoxGeometry(2.1,0.25,0.3);
const _bpMat=new THREE.MeshStandardMaterial({color:0x111111,roughness:0.7,metalness:0.3});
car.add(Object.assign(new THREE.Mesh(_bpGeo,_bpMat),{position:new THREE.Vector3(0,0.25,2.15)}));
car.add(Object.assign(new THREE.Mesh(_bpGeo,_bpMat),{position:new THREE.Vector3(0,0.25,-2.15)}));
const _mrGeo=new THREE.BoxGeometry(0.15,0.1,0.2);
const _mrMat=new THREE.MeshStandardMaterial({color:0x22c55e,roughness:0.35,metalness:0.4});
car.add(Object.assign(new THREE.Mesh(_mrGeo,_mrMat),{position:new THREE.Vector3(-1.1,0.85,0.5)}));
car.add(Object.assign(new THREE.Mesh(_mrGeo,_mrMat),{position:new THREE.Vector3(1.1,0.85,0.5)}));
const _rkGeo=new THREE.BoxGeometry(1.2,0.06,1.8);
const _rkMat=new THREE.MeshStandardMaterial({color:0x333333,roughness:0.5,metalness:0.5});
car.add(Object.assign(new THREE.Mesh(_rkGeo,_rkMat),{position:new THREE.Vector3(0,1.4,-0.1)}));
scene.add(car);`;
if (html.includes(carOld)) { html = html.replace(carOld, carNew); changes++; }

// ═══════════════════════════════════════
// 2. FLOWER BEDS in parks (before PARK BENCHES)
// ═══════════════════════════════════════
const flowersTarget = '// ---- PARK BENCHES ----';
const flowersCode = `// ---- FLOWER BEDS ----
{
  const _flColors=[0xff6b9d,0xfbbf24,0xff4444,0xc084fc,0xf472b6,0x60a5fa];
  const _flGeo=new THREE.SphereGeometry(0.25,5,4);
  const _FLN=80;
  const _flInst=new THREE.InstancedMesh(_flGeo,new THREE.MeshStandardMaterial({roughness:0.7,metalness:0.0}),_FLN);
  _flInst.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(_FLN*3),3);
  const _flc=new THREE.Color();
  for(let i=0;i<_FLN;i++){
    const _fz=i*35+25;
    const side=i%2===0?roadX(_fz)-14+Math.random()*3:roadX(_fz)+12+Math.random()*3;
    _flc.setHex(_flColors[Math.floor(Math.random()*_flColors.length)]);
    _flInst.instanceColor.setXYZ(i,_flc.r,_flc.g,_flc.b);
    dummy.position.set(side,roadY(_fz)+0.3,_fz);
    dummy.scale.setScalar(0.4+Math.random()*0.4);
    dummy.rotation.set(0,0,0);dummy.updateMatrix();
    _flInst.setMatrixAt(i,dummy.matrix);
  }
  _flInst.instanceMatrix.needsUpdate=true;_flInst.instanceColor.needsUpdate=true;
  scene.add(_flInst);
}
// ---- PARK BENCHES ----`;
if (html.includes(flowersTarget)) { html = html.replace(flowersTarget, flowersCode); changes++; }

// ═══════════════════════════════════════
// 3. FIRE HYDRANTS on sidewalks (before ROAD SIGNS)
// ═══════════════════════════════════════
const hydrantTarget = '// ---- ROAD SIGNS ----';
const hydrantCode = `// ---- FIRE HYDRANTS ----
{
  const _FHN=20;
  const _fhGeo=new THREE.CylinderGeometry(0.12,0.15,0.5,6);
  const _fhCap=new THREE.SphereGeometry(0.14,6,4);
  const _fhMat=new THREE.MeshStandardMaterial({color:0xcc2222,roughness:0.6,metalness:0.2});
  const _fhBI=new THREE.InstancedMesh(_fhGeo,_fhMat,_FHN);
  const _fhCI=new THREE.InstancedMesh(_fhCap,_fhMat,_FHN);
  for(let i=0;i<_FHN;i++){
    const z=i*140+50;const side=i%2===0?roadX(z)-6.2:roadX(z)+6.2;const hy=roadY(z);
    dummy.position.set(side,hy+0.35,z);dummy.scale.setScalar(1);dummy.rotation.set(0,0,0);dummy.updateMatrix();
    _fhBI.setMatrixAt(i,dummy.matrix);
    dummy.position.set(side,hy+0.65,z);dummy.updateMatrix();
    _fhCI.setMatrixAt(i,dummy.matrix);
  }
  _fhBI.instanceMatrix.needsUpdate=true;_fhCI.instanceMatrix.needsUpdate=true;
  scene.add(_fhBI);scene.add(_fhCI);
}
// ---- ROAD SIGNS ----`;
if (html.includes(hydrantTarget)) { html = html.replace(hydrantTarget, hydrantCode); changes++; }

// ═══════════════════════════════════════
// 4. CENTER DIVIDER double yellow line (before PARKS)
// ═══════════════════════════════════════
const dividerTarget = '// ---- PARKS ----';
const dividerCode = `// ---- CENTER DOUBLE YELLOW ----
{
  const _cdGeo=new THREE.PlaneGeometry(0.08,6);
  const _cdMat=new THREE.MeshStandardMaterial({color:0xfbbf24,emissive:0xfbbf24,emissiveIntensity:0.1,roughness:0.5});
  const _cdL=new THREE.InstancedMesh(_cdGeo,_cdMat,300);
  const _cdR=new THREE.InstancedMesh(_cdGeo,_cdMat,300);
  for(let i=0;i<300;i++){
    const _z=-50+i*10;
    dummy.position.set(roadX(_z)-0.15,roadY(_z)+0.035,_z);
    dummy.rotation.set(-Math.PI/2,0,0);dummy.scale.setScalar(1);dummy.updateMatrix();
    _cdL.setMatrixAt(i,dummy.matrix);
    dummy.position.set(roadX(_z)+0.15,roadY(_z)+0.035,_z);dummy.updateMatrix();
    _cdR.setMatrixAt(i,dummy.matrix);
  }
  _cdL.instanceMatrix.needsUpdate=true;_cdR.instanceMatrix.needsUpdate=true;
  scene.add(_cdL);scene.add(_cdR);
}
// ---- PARKS ----`;
if (html.includes(dividerTarget)) { html = html.replace(dividerTarget, dividerCode); changes++; }

// ═══════════════════════════════════════
// 5. COLORFUL PEDESTRIAN SHIRTS
// ═══════════════════════════════════════
const pedOld = "const pedBodyInst=new THREE.InstancedMesh(pedBodyGeo,new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0x4488cc}),PED_N);";
const pedNew = `const _shirtColors=[0x4488cc,0xcc4444,0x44cc88,0xcccc44,0xcc44cc,0xff8844,0x4466aa,0x886644];
  const pedBodyInst=new THREE.InstancedMesh(pedBodyGeo,new THREE.MeshStandardMaterial({roughness:0.7,metalness:0.05,color:0xffffff}),PED_N);
  pedBodyInst.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(PED_N*3),3);
  const _shc=new THREE.Color();`;
if (html.includes(pedOld)) { html = html.replace(pedOld, pedNew); changes++; }

// Add shirt color in ped loop
const pedColorOld = "pedHeadInst.instanceColor.setXYZ(i,_pedc.r,_pedc.g,_pedc.b);";
const pedColorNew = `pedHeadInst.instanceColor.setXYZ(i,_pedc.r,_pedc.g,_pedc.b);
    _shc.setHex(_shirtColors[Math.floor(Math.random()*_shirtColors.length)]);
    pedBodyInst.instanceColor.setXYZ(i,_shc.r,_shc.g,_shc.b);`;
if (html.includes(pedColorOld)) { html = html.replace(pedColorOld, pedColorNew); changes++; }

// needsUpdate for body colors
const pedUpdateOld = "pedBodyInst.instanceMatrix.needsUpdate=true;\n  pedHeadInst.instanceMatrix.needsUpdate=true;";
const pedUpdateNew = "pedBodyInst.instanceMatrix.needsUpdate=true;\n  if(pedBodyInst.instanceColor)pedBodyInst.instanceColor.needsUpdate=true;\n  pedHeadInst.instanceMatrix.needsUpdate=true;";
if (html.includes(pedUpdateOld)) { html = html.replace(pedUpdateOld, pedUpdateNew); changes++; }

fs.writeFileSync('index.html', html);
console.log('Safe art applied! Changes: ' + changes);
