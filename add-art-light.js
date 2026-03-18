const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
let ok = 0;

function safe(name, old, rep) {
  if (html.includes(old)) { html = html.replace(old, rep); ok++; console.log('  ✅ ' + name); }
  else { console.log('  ⏭️ ' + name); }
}

console.log('=== ADD ART (GPU-optimized materials) ===\n');

// ALL new objects use MeshPhongMaterial or MeshBasicMaterial — NOT MeshStandard!

// 1. CAR bumpers + mirrors
safe('Car details',
  'scene.add(car);',
  `car.add(Object.assign(new THREE.Mesh(new THREE.BoxGeometry(2.1,0.2,0.25),new THREE.MeshPhongMaterial({color:0x111111,shininess:20})),{position:new THREE.Vector3(0,0.25,2.15)}));
car.add(Object.assign(new THREE.Mesh(new THREE.BoxGeometry(2.1,0.2,0.25),new THREE.MeshPhongMaterial({color:0x111111,shininess:20})),{position:new THREE.Vector3(0,0.25,-2.15)}));
car.add(Object.assign(new THREE.Mesh(new THREE.BoxGeometry(0.12,0.08,0.15),new THREE.MeshPhongMaterial({color:0x22c55e,shininess:30})),{position:new THREE.Vector3(-1.1,0.85,0.5)}));
car.add(Object.assign(new THREE.Mesh(new THREE.BoxGeometry(0.12,0.08,0.15),new THREE.MeshPhongMaterial({color:0x22c55e,shininess:30})),{position:new THREE.Vector3(1.1,0.85,0.5)}));
scene.add(car);`
);

// 2. Center road double yellow (MeshBasicMaterial — zero GPU cost)
safe('Center yellow line',
  '// ---- PARKS ----',
  `// ---- CENTER DOUBLE YELLOW ----
{const _cdG=new THREE.PlaneGeometry(0.06,5);const _cdM=new THREE.MeshBasicMaterial({color:0xddaa22});const _cdL=new THREE.InstancedMesh(_cdG,_cdM,200);const _cdR=new THREE.InstancedMesh(_cdG,_cdM,200);for(let i=0;i<200;i++){const _z=-50+i*15;dummy.position.set(roadX(_z)-0.12,roadY(_z)+0.03,_z);dummy.rotation.set(-Math.PI/2,0,0);dummy.scale.setScalar(1);dummy.updateMatrix();_cdL.setMatrixAt(i,dummy.matrix);dummy.position.set(roadX(_z)+0.12,roadY(_z)+0.03,_z);dummy.updateMatrix();_cdR.setMatrixAt(i,dummy.matrix)}_cdL.instanceMatrix.needsUpdate=true;_cdR.instanceMatrix.needsUpdate=true;scene.add(_cdL);scene.add(_cdR)}
// ---- PARKS ----`
);

// 3. Flower beds (MeshBasicMaterial — cheapest possible)
safe('Flowers',
  '// ---- PARK BENCHES ----',
  `// ---- FLOWER BEDS ----
{const _flC=[0xff6b9d,0xfbbf24,0xff4444,0xc084fc,0xf472b6];const _flG=new THREE.SphereGeometry(0.18,3,2);const _FN=30;const _flI=new THREE.InstancedMesh(_flG,new THREE.MeshBasicMaterial({color:0xffffff}),_FN);_flI.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(_FN*3),3);const _fc=new THREE.Color();for(let i=0;i<_FN;i++){const _fz=i*90+25;const side=i%2===0?roadX(_fz)-13+Math.random()*2:roadX(_fz)+12+Math.random()*2;_fc.setHex(_flC[Math.floor(Math.random()*_flC.length)]);_flI.instanceColor.setXYZ(i,_fc.r,_fc.g,_fc.b);dummy.position.set(side,roadY(_fz)+0.2,_fz);dummy.scale.setScalar(0.4+Math.random()*0.3);dummy.rotation.set(0,0,0);dummy.updateMatrix();_flI.setMatrixAt(i,dummy.matrix)}_flI.instanceMatrix.needsUpdate=true;_flI.instanceColor.needsUpdate=true;scene.add(_flI)}
// ---- PARK BENCHES ----`
);

// 4. Fire hydrants (MeshPhongMaterial — one material shared)
safe('Hydrants',
  '// ---- ROAD SIGNS ----',
  `// ---- FIRE HYDRANTS ----
{const _FH=10;const _fhG=new THREE.CylinderGeometry(0.1,0.12,0.4,4);const _fhM=new THREE.MeshPhongMaterial({color:0xcc2222,shininess:10});const _fhI=new THREE.InstancedMesh(_fhG,_fhM,_FH);for(let i=0;i<_FH;i++){const z=i*280+80;const side=i%2===0?roadX(z)-6.2:roadX(z)+6.2;dummy.position.set(side,roadY(z)+0.25,z);dummy.scale.setScalar(1);dummy.rotation.set(0,0,0);dummy.updateMatrix();_fhI.setMatrixAt(i,dummy.matrix)}_fhI.instanceMatrix.needsUpdate=true;scene.add(_fhI)}
// ---- ROAD SIGNS ----`
);

// 5. Guardrail posts (MeshBasicMaterial — cheapest)
safe('Guardrails',
  '// ---- TRAFFIC LIGHTS ----',
  `// ---- GUARDRAILS ----
{const _GN=50;const _grG=new THREE.BoxGeometry(0.06,0.6,0.06);const _grM=new THREE.MeshBasicMaterial({color:0x777788});const _grI=new THREE.InstancedMesh(_grG,_grM,_GN);for(let i=0;i<_GN;i++){const z=i*55+20;const rx=roadX(z);const side=i%2===0?rx-6.3:rx+6.3;dummy.position.set(side,roadY(z)+0.35,z);dummy.scale.setScalar(1);dummy.rotation.set(0,0,0);dummy.updateMatrix();_grI.setMatrixAt(i,dummy.matrix)}_grI.instanceMatrix.needsUpdate=true;scene.add(_grI)}
// ---- TRAFFIC LIGHTS ----`
);

// 6. Colored pedestrian shirts
safe('Ped shirts',
  "const pedBodyInst=new THREE.InstancedMesh(pedBodyGeo,new THREE.MeshPhongMaterial({color:0x4488cc,shininess:5}),PED_N);",
  `const _shC=[0x4488cc,0xcc4444,0x44cc88,0xcccc44,0xcc44cc,0xff8844,0x4466aa];
  const pedBodyInst=new THREE.InstancedMesh(pedBodyGeo,new THREE.MeshPhongMaterial({color:0xffffff,shininess:5}),PED_N);
  pedBodyInst.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(PED_N*3),3);
  const _sc2=new THREE.Color();`
);

safe('Shirt assign',
  "pedHeadInst.instanceColor.setXYZ(i,_pedc.r,_pedc.g,_pedc.b);",
  `pedHeadInst.instanceColor.setXYZ(i,_pedc.r,_pedc.g,_pedc.b);
    _sc2.setHex(_shC[Math.floor(Math.random()*_shC.length)]);
    pedBodyInst.instanceColor.setXYZ(i,_sc2.r,_sc2.g,_sc2.b);`
);

safe('Shirt update',
  "pedBodyInst.instanceMatrix.needsUpdate=true;\n  pedHeadInst.instanceMatrix.needsUpdate=true;",
  "pedBodyInst.instanceMatrix.needsUpdate=true;\n  if(pedBodyInst.instanceColor)pedBodyInst.instanceColor.needsUpdate=true;\n  pedHeadInst.instanceMatrix.needsUpdate=true;"
);

// 7. HUD - cleaner lives
safe('Lives dots',
  "document.getElementById('livesVal').textContent='🧒'.repeat(friendsN)+(lives<5?' 😢'.repeat(5-friendsN):'');",
  "document.getElementById('livesVal').innerHTML='<span style=\"color:#4ade80\">'+('●').repeat(friendsN)+'</span>'+(lives<5?'<span style=\"color:#444\">'+('●').repeat(5-friendsN)+'</span>':'');"
);

fs.writeFileSync('index.html', html);
console.log('\n=== DONE: ' + ok + ' additions (all GPU-light materials) ===');
