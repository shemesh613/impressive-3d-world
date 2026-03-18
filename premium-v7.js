const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// ═══════════════════════════════════════
// 1. WINDOWS - Much brighter + slight randomized warm colors
// ═══════════════════════════════════════
html = html.replace(
  "const mat=new THREE.MeshStandardMaterial({color:0xffeeaa,emissive:0xffcc55,emissiveIntensity:1.2,roughness:0.1,metalness:0.0});",
  "const mat=new THREE.MeshStandardMaterial({color:0xffeeaa,emissive:0xffcc44,emissiveIntensity:2.0,roughness:0.05,metalness:0.0});"
);

// Also add some dark (unlit) windows for realism
html = html.replace(
  "if(Math.random()>.25)wp.push(b[0]+x*.8,y*1.2+1.2,b[1]+b[4]/2+.01)",
  "if(Math.random()>.2)wp.push(b[0]+x*.8,y*1.2+1.2,b[1]+b[4]/2+.01)"
);

// ═══════════════════════════════════════
// 2. LAMP POST GLOW - Add halo ring around each lamp
// ═══════════════════════════════════════
html = html.replace(
  "poleInst.instanceMatrix.needsUpdate=true;glowInst.instanceMatrix.needsUpdate=true;  scene.add(poleInst);scene.add(glowInst);}",
  `poleInst.instanceMatrix.needsUpdate=true;glowInst.instanceMatrix.needsUpdate=true;scene.add(poleInst);scene.add(glowInst);
  // Lamp halo rings
  const haloGeo=new THREE.RingGeometry(0.6,1.8,16);
  const haloMat=new THREE.MeshBasicMaterial({color:0xffeeaa,transparent:true,opacity:0.06,side:THREE.DoubleSide,depthWrite:false});
  const haloInst=new THREE.InstancedMesh(haloGeo,haloMat,lampPositions.length);
  lampPositions.forEach(([x,z],i)=>{
    dummy.position.set(x,roadY(z)+4.2,z);dummy.rotation.set(-Math.PI/2,0,0);dummy.scale.setScalar(1);dummy.updateMatrix();
    haloInst.setMatrixAt(i,dummy.matrix);
  });
  haloInst.instanceMatrix.needsUpdate=true;scene.add(haloInst);
}`
);

// ═══════════════════════════════════════
// 3. Add POINT LIGHTS near key lamp posts for real illumination
// ═══════════════════════════════════════
html = html.replace(
  "// Ground fog planes for atmosphere",
  `// Dynamic point lights at lamp posts (first 6 only for perf)
for(let li=0;li<6;li++){
  const pl=new THREE.PointLight(0xffeeaa,0.6,25,2);
  pl.position.set(0,4.5,li*80);
  scene.add(pl);
  if(!window._lampLights)window._lampLights=[];
  window._lampLights.push(pl);
}
// Ground fog planes for atmosphere`
);

// ═══════════════════════════════════════
// 4. Move point lights with camera in animation loop
// ═══════════════════════════════════════
// Find the animation/render loop and add point light update
html = html.replace(
  "renderer.render(scene,cam);",
  `// Update lamp point lights to follow player
if(window._lampLights){
  const cz=car.position.z;
  window._lampLights.forEach((pl,i)=>{
    const lz=cz+i*40-40;
    const lx=roadX(lz)+(i%2===0?-6:6);
    pl.position.set(lx,roadY(lz)+4.5,lz);
  });
}
renderer.render(scene,cam);`
);

// ═══════════════════════════════════════
// 5. ROAD GLOW - make the green edge glow spread wider
// ═══════════════════════════════════════
html = html.replace(
  "const glowGeo=new THREE.PlaneGeometry(2.5,SLEN);",
  "const glowGeo=new THREE.PlaneGeometry(3.5,SLEN);"
);
html = html.replace(
  "const glowMat=new THREE.MeshStandardMaterial({color:0x0d3320,emissive:0x115530,emissiveIntensity:0.25,roughness:0.6,metalness:0.0});",
  "const glowMat=new THREE.MeshStandardMaterial({color:0x0d3320,emissive:0x115530,emissiveIntensity:0.35,roughness:0.5,metalness:0.0});"
);

// ═══════════════════════════════════════
// 6. STARS - more visible, slight twinkle via size variation
// ═══════════════════════════════════════
html = html.replace(
  "const STAR_N=80;",
  "const STAR_N=150;"
);

// ═══════════════════════════════════════
// 7. CLOUDS - slightly more visible
// ═══════════════════════════════════════
html = html.replace(
  "const cloudMat=new THREE.MeshBasicMaterial({color:0x1a3a2a,transparent:true,opacity:.4});",
  "const cloudMat=new THREE.MeshBasicMaterial({color:0x1a2a3a,transparent:true,opacity:.25});"
);

// ═══════════════════════════════════════
// 8. TRUNK color richer
// ═══════════════════════════════════════
html = html.replace(
  "const trunkMat=new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0x5c4033});",
  "const trunkMat=new THREE.MeshStandardMaterial({roughness:0.85,metalness:0.0,color:0x4a3020});"
);

fs.writeFileSync('index.html', html);
console.log('Premium v7 applied!');
