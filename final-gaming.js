const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
let ok = 0, fail = 0;

function safe(name, old, rep) {
  if (html.includes(old)) { html = html.replace(old, rep); ok++; console.log('  ✅ ' + name); }
  else { fail++; console.log('  ❌ SKIP: ' + name); }
}

console.log('=== FINAL GAMING UPGRADE ===\n');

// ═══════════════════════════════════════
// CAR: bumpers + mirrors
// ═══════════════════════════════════════
safe('Car bumpers+mirrors',
  'scene.add(car);',
  `car.add(Object.assign(new THREE.Mesh(new THREE.BoxGeometry(2.1,0.2,0.25),new THREE.MeshStandardMaterial({color:0x111111,roughness:0.7,metalness:0.3})),{position:new THREE.Vector3(0,0.25,2.15)}));
car.add(Object.assign(new THREE.Mesh(new THREE.BoxGeometry(2.1,0.2,0.25),new THREE.MeshStandardMaterial({color:0x111111,roughness:0.7,metalness:0.3})),{position:new THREE.Vector3(0,0.25,-2.15)}));
car.add(Object.assign(new THREE.Mesh(new THREE.BoxGeometry(0.12,0.08,0.15),new THREE.MeshStandardMaterial({color:0x22c55e,roughness:0.35,metalness:0.4})),{position:new THREE.Vector3(-1.1,0.85,0.5)}));
car.add(Object.assign(new THREE.Mesh(new THREE.BoxGeometry(0.12,0.08,0.15),new THREE.MeshStandardMaterial({color:0x22c55e,roughness:0.35,metalness:0.4})),{position:new THREE.Vector3(1.1,0.85,0.5)}));
scene.add(car);`
);

// ═══════════════════════════════════════
// ROAD: center double yellow line
// ═══════════════════════════════════════
safe('Center yellow line',
  '// ---- PARKS ----',
  `// ---- CENTER DOUBLE YELLOW ----
{const _cdG=new THREE.PlaneGeometry(0.06,5);const _cdM=new THREE.MeshStandardMaterial({color:0xfbbf24,emissive:0xfbbf24,emissiveIntensity:0.15,roughness:0.5});const _cdL=new THREE.InstancedMesh(_cdG,_cdM,200);const _cdR=new THREE.InstancedMesh(_cdG,_cdM,200);for(let i=0;i<200;i++){const _z=-50+i*15;dummy.position.set(roadX(_z)-0.12,roadY(_z)+0.03,_z);dummy.rotation.set(-Math.PI/2,0,0);dummy.scale.setScalar(1);dummy.updateMatrix();_cdL.setMatrixAt(i,dummy.matrix);dummy.position.set(roadX(_z)+0.12,roadY(_z)+0.03,_z);dummy.updateMatrix();_cdR.setMatrixAt(i,dummy.matrix)}_cdL.instanceMatrix.needsUpdate=true;_cdR.instanceMatrix.needsUpdate=true;scene.add(_cdL);scene.add(_cdR)}
// ---- PARKS ----`
);

// ═══════════════════════════════════════
// FLOWERS in parks (small count)
// ═══════════════════════════════════════
safe('Flower beds',
  '// ---- PARK BENCHES ----',
  `// ---- FLOWER BEDS ----
{const _flC=[0xff6b9d,0xfbbf24,0xff4444,0xc084fc,0xf472b6];const _flG=new THREE.SphereGeometry(0.2,4,3);const _FN=40;const _flI=new THREE.InstancedMesh(_flG,new THREE.MeshStandardMaterial({roughness:0.7,metalness:0.0}),_FN);_flI.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(_FN*3),3);const _fc=new THREE.Color();for(let i=0;i<_FN;i++){const _fz=i*70+25;const side=i%2===0?roadX(_fz)-13+Math.random()*2:roadX(_fz)+12+Math.random()*2;_fc.setHex(_flC[Math.floor(Math.random()*_flC.length)]);_flI.instanceColor.setXYZ(i,_fc.r,_fc.g,_fc.b);dummy.position.set(side,roadY(_fz)+0.25,_fz);dummy.scale.setScalar(0.4+Math.random()*0.3);dummy.rotation.set(0,0,0);dummy.updateMatrix();_flI.setMatrixAt(i,dummy.matrix)}_flI.instanceMatrix.needsUpdate=true;_flI.instanceColor.needsUpdate=true;scene.add(_flI)}
// ---- PARK BENCHES ----`
);

// ═══════════════════════════════════════
// FIRE HYDRANTS (small count)
// ═══════════════════════════════════════
safe('Fire hydrants',
  '// ---- ROAD SIGNS ----',
  `// ---- FIRE HYDRANTS ----
{const _FH=12;const _fhG=new THREE.CylinderGeometry(0.1,0.13,0.45,5);const _fhM=new THREE.MeshStandardMaterial({color:0xcc2222,roughness:0.6,metalness:0.2});const _fhI=new THREE.InstancedMesh(_fhG,_fhM,_FH);for(let i=0;i<_FH;i++){const z=i*230+80;const side=i%2===0?roadX(z)-6.2:roadX(z)+6.2;dummy.position.set(side,roadY(z)+0.3,z);dummy.scale.setScalar(1);dummy.rotation.set(0,0,0);dummy.updateMatrix();_fhI.setMatrixAt(i,dummy.matrix)}_fhI.instanceMatrix.needsUpdate=true;scene.add(_fhI)}
// ---- ROAD SIGNS ----`
);

// ═══════════════════════════════════════
// COLORED PEDESTRIAN SHIRTS
// ═══════════════════════════════════════
safe('Colored shirts',
  "const pedBodyInst=new THREE.InstancedMesh(pedBodyGeo,new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0x4488cc}),PED_N);",
  `const _shC=[0x4488cc,0xcc4444,0x44cc88,0xcccc44,0xcc44cc,0xff8844,0x4466aa];
  const pedBodyInst=new THREE.InstancedMesh(pedBodyGeo,new THREE.MeshStandardMaterial({roughness:0.7,metalness:0.05,color:0xffffff}),PED_N);
  pedBodyInst.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(PED_N*3),3);
  const _sc2=new THREE.Color();`
);

safe('Shirt color assign',
  "pedHeadInst.instanceColor.setXYZ(i,_pedc.r,_pedc.g,_pedc.b);",
  `pedHeadInst.instanceColor.setXYZ(i,_pedc.r,_pedc.g,_pedc.b);
    _sc2.setHex(_shC[Math.floor(Math.random()*_shC.length)]);
    pedBodyInst.instanceColor.setXYZ(i,_sc2.r,_sc2.g,_sc2.b);`
);

safe('Shirt color update',
  "pedBodyInst.instanceMatrix.needsUpdate=true;\n  pedHeadInst.instanceMatrix.needsUpdate=true;",
  "pedBodyInst.instanceMatrix.needsUpdate=true;\n  if(pedBodyInst.instanceColor)pedBodyInst.instanceColor.needsUpdate=true;\n  pedHeadInst.instanceMatrix.needsUpdate=true;"
);

// ═══════════════════════════════════════
// OBSTACLES: octahedron instead of box
// ═══════════════════════════════════════
safe('Better obstacles',
  "const obsInst=new THREE.InstancedMesh(new THREE.BoxGeometry(2,2,2),new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0xff2222,transparent:true,opacity:0.9}),MAX_OBS);",
  "const obsInst=new THREE.InstancedMesh(new THREE.OctahedronGeometry(1.2,0),new THREE.MeshStandardMaterial({color:0xff3333,emissive:0xff1111,emissiveIntensity:0.5,roughness:0.3,metalness:0.2,transparent:true,opacity:0.85}),MAX_OBS);"
);

// ═══════════════════════════════════════
// POWERUPS: golden glow
// ═══════════════════════════════════════
safe('Powerup glow',
  "const powerupInst=new THREE.InstancedMesh(new THREE.OctahedronGeometry(.8,1),new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0xfbbf24}),MAX_POWERUPS);",
  "const powerupInst=new THREE.InstancedMesh(new THREE.OctahedronGeometry(.8,1),new THREE.MeshStandardMaterial({color:0xfbbf24,emissive:0xffaa00,emissiveIntensity:0.4,roughness:0.2,metalness:0.5}),MAX_POWERUPS);"
);

// ═══════════════════════════════════════
// HUD: cleaner lives display
// ═══════════════════════════════════════
safe('Clean lives display',
  "document.getElementById('livesVal').textContent='🧒'.repeat(friendsN)+(lives<5?' 😢'.repeat(5-friendsN):'');",
  "document.getElementById('livesVal').innerHTML='<span style=\"color:#4ade80\">'+('●').repeat(friendsN)+'</span>'+(lives<5?'<span style=\"color:#333\">'+('●').repeat(5-friendsN)+'</span>':'');"
);

safe('Lives font size',
  "#livesVal{color:#60a5fa;font-size:13px}",
  "#livesVal{color:#60a5fa;font-size:16px;letter-spacing:2px}"
);

// ═══════════════════════════════════════
// FLOW BAR wider
// ═══════════════════════════════════════
safe('Wider flow bar',
  "#flowBar{width:130px;height:14px;",
  "#flowBar{width:160px;height:16px;"
);

fs.writeFileSync('index.html', html);
console.log('\n=== DONE: ' + ok + ' applied, ' + fail + ' skipped ===');
