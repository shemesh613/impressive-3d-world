const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. CROSS TRAFFIC - Add wheels + headlights + metallic materials
html = html.replace(
  'window._ctData={bodyInst:ctBodyInst,roofInst:ctRoofInst,data:ctData,n:CT_N};',
  `// Cross traffic wheels
  const ctWheelGeo=new THREE.CylinderGeometry(0.18,0.18,0.12,6);
  const ctWheelMat=new THREE.MeshStandardMaterial({color:0x1a1a1a,roughness:0.9,metalness:0.15});
  const ctWheelInst=new THREE.InstancedMesh(ctWheelGeo,ctWheelMat,CT_N*4);
  ctWheelInst.instanceMatrix.needsUpdate=true;
  scene.add(ctWheelInst);
  const ctHlGeo=new THREE.BoxGeometry(0.15,0.08,0.04);
  const ctHlMat=new THREE.MeshStandardMaterial({color:0xffffdd,emissive:0xffff88,emissiveIntensity:0.7,roughness:0.2,metalness:0.5});
  const ctHlInst=new THREE.InstancedMesh(ctHlGeo,ctHlMat,CT_N*2);
  ctHlInst.instanceMatrix.needsUpdate=true;
  scene.add(ctHlInst);
  const ctTlGeo=new THREE.BoxGeometry(0.12,0.06,0.04);
  const ctTlMat=new THREE.MeshStandardMaterial({color:0xff4444,emissive:0xff2200,emissiveIntensity:0.8,roughness:0.3,metalness:0.2});
  const ctTlInst=new THREE.InstancedMesh(ctTlGeo,ctTlMat,CT_N*2);
  ctTlInst.instanceMatrix.needsUpdate=true;
  scene.add(ctTlInst);
  window._ctData={bodyInst:ctBodyInst,roofInst:ctRoofInst,wheelInst:ctWheelInst,hlInst:ctHlInst,tlInst:ctTlInst,data:ctData,n:CT_N};`
);

// Cross traffic metallic body
html = html.replace(
  'const ctBodyInst=new THREE.InstancedMesh(ctGeo,new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0xffffff}),CT_N);',
  'const ctBodyInst=new THREE.InstancedMesh(ctGeo,new THREE.MeshStandardMaterial({roughness:0.35,metalness:0.4,color:0xffffff}),CT_N);'
);
html = html.replace(
  'const ctRoofInst=new THREE.InstancedMesh(ctRoofGeo,new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0x111111}),CT_N);',
  'const ctRoofInst=new THREE.InstancedMesh(ctRoofGeo,new THREE.MeshStandardMaterial({roughness:0.15,metalness:0.7,color:0x1a2a3a}),CT_N);'
);

// 2. PARKED CARS - metallic + wheels
html = html.replace(
  'const pCarBodyInst=new THREE.InstancedMesh(pCarBodyGeo,new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0xffffff}),PARKED_N);',
  'const pCarBodyInst=new THREE.InstancedMesh(pCarBodyGeo,new THREE.MeshStandardMaterial({roughness:0.35,metalness:0.4,color:0xffffff}),PARKED_N);'
);
html = html.replace(
  'const pCarRoofInst=new THREE.InstancedMesh(pCarRoofGeo,new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0x111111}),PARKED_N);',
  'const pCarRoofInst=new THREE.InstancedMesh(pCarRoofGeo,new THREE.MeshStandardMaterial({roughness:0.15,metalness:0.7,color:0x1a2a3a}),PARKED_N);'
);

// Add wheels to parked cars
html = html.replace(
  '  scene.add(pCarBodyInst);\n  scene.add(pCarRoofInst);\n}',
  `  scene.add(pCarBodyInst);
  scene.add(pCarRoofInst);
  // Parked car wheels
  const pWhlGeo=new THREE.CylinderGeometry(0.16,0.16,0.1,6);
  const pWhlMat=new THREE.MeshStandardMaterial({color:0x1a1a1a,roughness:0.9,metalness:0.15});
  const pWhlInst=new THREE.InstancedMesh(pWhlGeo,pWhlMat,PARKED_N*4);
  for(let i=0;i<PARKED_N;i++){
    const _pz2=30+i*100+Math.random()*40;
    const _ps2=i%2===0?roadX(_pz2)-5.8:roadX(_pz2)+5.8;
    const _phy=roadY(_pz2);
    [[-0.45,_phy+0.16,_pz2+0.7],[0.45,_phy+0.16,_pz2+0.7],[-0.45,_phy+0.16,_pz2-0.7],[0.45,_phy+0.16,_pz2-0.7]].forEach((p,wi)=>{
      dummy.position.set(_ps2+p[0],p[1],p[2]);dummy.rotation.set(0,0,Math.PI/2);dummy.scale.setScalar(1);dummy.updateMatrix();
      pWhlInst.setMatrixAt(i*4+wi,dummy.matrix);
    });
  }
  pWhlInst.instanceMatrix.needsUpdate=true;scene.add(pWhlInst);
}`
);

// 3. PEDESTRIANS - Better proportions + legs
html = html.replace(
  'const pedBodyGeo=new THREE.CylinderGeometry(0.15,0.15,0.8,5);',
  'const pedBodyGeo=new THREE.CylinderGeometry(0.12,0.16,0.5,6);'
);

// Add pedestrian legs after creation
html = html.replace(
  'window._pedData={bodyInst:pedBodyInst,headInst:pedHeadInst,data:pedData,n:PED_N};',
  `// Pedestrian legs
  const pedLegGeo=new THREE.CylinderGeometry(0.05,0.06,0.35,4);
  const pedLegMat=new THREE.MeshStandardMaterial({color:0x2a2a4a,roughness:0.8,metalness:0.05});
  const pedLegLI=new THREE.InstancedMesh(pedLegGeo,pedLegMat,PED_N);
  const pedLegRI=new THREE.InstancedMesh(pedLegGeo,pedLegMat,PED_N);
  for(let i=0;i<PED_N;i++){
    const pd=pedData[i];const hy=roadY(pd.z);
    dummy.scale.setScalar(1);dummy.rotation.set(0,0,0);
    dummy.position.set(pd.x-0.07,hy+0.18,pd.z);dummy.updateMatrix();pedLegLI.setMatrixAt(i,dummy.matrix);
    dummy.position.set(pd.x+0.07,hy+0.18,pd.z);dummy.updateMatrix();pedLegRI.setMatrixAt(i,dummy.matrix);
  }
  pedLegLI.instanceMatrix.needsUpdate=true;pedLegRI.instanceMatrix.needsUpdate=true;
  scene.add(pedLegLI);scene.add(pedLegRI);
  window._pedData={bodyInst:pedBodyInst,headInst:pedHeadInst,legL:pedLegLI,legR:pedLegRI,data:pedData,n:PED_N};`
);

// 4. BUILDING ROOFTOP DETAILS - antennas with red blinking lights
html = html.replace(
  '// Windows\n{',
  `// Building roof accents + antennas
{
  const roofN=Math.min(bdata.length,200);
  const antN=Math.floor(roofN/3);
  const antGeo=new THREE.CylinderGeometry(0.02,0.02,2,3);
  const antMat=new THREE.MeshStandardMaterial({color:0x888888,roughness:0.4,metalness:0.8});
  const antInst=new THREE.InstancedMesh(antGeo,antMat,antN);
  const antLGeo=new THREE.SphereGeometry(0.08,4,4);
  const antLMat=new THREE.MeshStandardMaterial({color:0xff0000,emissive:0xff0000,emissiveIntensity:1.0,roughness:0.1});
  const antLInst=new THREE.InstancedMesh(antLGeo,antLMat,antN);
  for(let i=0;i<antN;i++){
    const b=bdata[i*3];
    dummy.position.set(b[0]+0.5,roadY(b[1])+b[3]+1,b[1]);
    dummy.scale.setScalar(1);dummy.rotation.set(0,0,0);dummy.updateMatrix();
    antInst.setMatrixAt(i,dummy.matrix);
    dummy.position.set(b[0]+0.5,roadY(b[1])+b[3]+2.05,b[1]);dummy.updateMatrix();
    antLInst.setMatrixAt(i,dummy.matrix);
  }
  antInst.instanceMatrix.needsUpdate=true;antLInst.instanceMatrix.needsUpdate=true;
  scene.add(antInst);scene.add(antLInst);
}
// Wider glowing windows
{`
);

// Make windows taller
html = html.replace(
  "const n=wp.length/3;const geo=new THREE.PlaneGeometry(.35,.35);",
  "const n=wp.length/3;const geo=new THREE.PlaneGeometry(.4,.55);"
);

fs.writeFileSync('index.html', html);
console.log('Done! All 3D details added.');
