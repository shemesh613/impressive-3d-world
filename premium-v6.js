const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// ═══════════════════════════════════════
// 1. ENABLE ANTIALIAS for smoother edges
// ═══════════════════════════════════════
html = html.replace(
  "antialias:false,powerPreference:'high-performance'",
  "antialias:true,powerPreference:'high-performance'"
);

// ═══════════════════════════════════════
// 2. BEAUTIFUL SKY GRADIENT (replace black sky dome)
// ═══════════════════════════════════════
html = html.replace(
  "scene.add(new THREE.Mesh(new THREE.SphereGeometry(200,8,4),new THREE.MeshBasicMaterial({color:0x071020,side:THREE.BackSide})));",
  `// Premium sky dome with gradient
{
  const skyGeo=new THREE.SphereGeometry(250,32,16);
  const skyMat=new THREE.ShaderMaterial({
    side:THREE.BackSide,
    uniforms:{},
    vertexShader:\`
      varying vec3 vWorldPosition;
      void main(){
        vec4 worldPos=modelMatrix*vec4(position,1.0);
        vWorldPosition=worldPos.xyz;
        gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);
      }
    \`,
    fragmentShader:\`
      varying vec3 vWorldPosition;
      void main(){
        float h=normalize(vWorldPosition).y;
        vec3 night=vec3(0.02,0.04,0.08);
        vec3 horizon=vec3(0.05,0.08,0.15);
        vec3 glow=vec3(0.08,0.12,0.22);
        vec3 col=mix(horizon,night,smoothstep(0.0,0.5,h));
        col=mix(glow,col,smoothstep(-0.1,0.15,h));
        gl_FragColor=vec4(col,1.0);
      }
    \`
  });
  scene.add(new THREE.Mesh(skyGeo,skyMat));
}`
);

// ═══════════════════════════════════════
// 3. WET ROAD EFFECT (reflective asphalt)
// ═══════════════════════════════════════
html = html.replace(
  "new THREE.PlaneGeometry(11,SLEN),new THREE.MeshStandardMaterial({color:0x2a3050,roughness:0.85,metalness:0.1})",
  "new THREE.PlaneGeometry(11,SLEN),new THREE.MeshStandardMaterial({color:0x2a3050,roughness:0.55,metalness:0.25})"
);

// ═══════════════════════════════════════
// 4. BOOST EXPOSURE for richer colors
// ═══════════════════════════════════════
html = html.replace(
  "renderer.toneMappingExposure=1.1;",
  "renderer.toneMappingExposure=1.25;"
);

// ═══════════════════════════════════════
// 5. ADD GROUND FOG (low-lying atmospheric fog)
// ═══════════════════════════════════════
// Insert after the moon light setup
html = html.replace(
  "const moonLight=new THREE.DirectionalLight(0xaaccff,0.3);\nmoonLight.position.set(-20,40,-30);\nscene.add(moonLight);",
  `const moonLight=new THREE.DirectionalLight(0xaaccff,0.3);
moonLight.position.set(-20,40,-30);
scene.add(moonLight);
// Ground fog planes for atmosphere
const fogPlaneGeo=new THREE.PlaneGeometry(200,200);
const fogPlaneMat=new THREE.MeshBasicMaterial({color:0x0a1628,transparent:true,opacity:0.15,depthWrite:false});
for(let i=0;i<3;i++){
  const fp=new THREE.Mesh(fogPlaneGeo,fogPlaneMat);
  fp.rotation.x=-Math.PI/2;
  fp.position.set(0,0.5+i*2,500+i*400);
  scene.add(fp);
}`
);

// ═══════════════════════════════════════
// 6. LAMP POSTS - bigger glow orbs
// ═══════════════════════════════════════
html = html.replace(
  "const glowGeo=new THREE.SphereGeometry(.25,4,4);",
  "const glowGeo=new THREE.SphereGeometry(.4,6,6);"
);

// ═══════════════════════════════════════
// 7. BALLOON GLOW (emissive balloons)
// ═══════════════════════════════════════
html = html.replace(
  "const blnMat=new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0xffffff});",
  "const blnMat=new THREE.MeshStandardMaterial({roughness:0.4,metalness:0.1,color:0xffffff,emissive:0xffffff,emissiveIntensity:0.15});"
);

// ═══════════════════════════════════════
// 8. SIDEWALK - lighter color for contrast
// ═══════════════════════════════════════
html = html.replace(
  "const swMat=new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0x2a6a4e});",
  "const swMat=new THREE.MeshStandardMaterial({roughness:0.8,metalness:0.05,color:0x4a5a6a});"
);

// ═══════════════════════════════════════
// 9. PARK GROUND - richer green
// ═══════════════════════════════════════
html = html.replace(
  "const parkMat=new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0x1a7a40});",
  "const parkMat=new THREE.MeshStandardMaterial({roughness:0.7,metalness:0.0,color:0x1a5a30});"
);

// ═══════════════════════════════════════
// 10. ZEBRA CROSSINGS - brighter
// ═══════════════════════════════════════
html = html.replace(
  "const zebraMat=new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0xffffcc});",
  "const zebraMat=new THREE.MeshStandardMaterial({roughness:0.6,metalness:0.05,color:0xffffdd,emissive:0xffffaa,emissiveIntensity:0.15});"
);

// ═══════════════════════════════════════
// 11. BENCH - wooden look
// ═══════════════════════════════════════
html = html.replace(
  "const benchMat=new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0x8B5A2B});",
  "const benchMat=new THREE.MeshStandardMaterial({roughness:0.85,metalness:0.0,color:0x8B5A2B});"
);

// ═══════════════════════════════════════
// 12. PLAYER CAR - add subtle headlight beam
// ═══════════════════════════════════════
html = html.replace(
  "scene.add(car);",
  `// Headlight beam cones
const beamGeo=new THREE.ConeGeometry(1.5,8,8,1,true);
const beamMat=new THREE.MeshBasicMaterial({color:0xffffdd,transparent:true,opacity:0.04,depthWrite:false,side:THREE.DoubleSide});
const beamL=new THREE.Mesh(beamGeo,beamMat);
beamL.rotation.x=Math.PI/2;beamL.position.set(-0.5,0.5,6);car.add(beamL);
const beamR=new THREE.Mesh(beamGeo,beamMat);
beamR.rotation.x=Math.PI/2;beamR.position.set(0.5,0.5,6);car.add(beamR);
scene.add(car);`
);

// ═══════════════════════════════════════
// 13. SHOP AWNINGS - better colors
// ═══════════════════════════════════════
html = html.replace(
  "const shopColors=[0xff3366,0x33ccff,0xffcc00,0x66ff33,0xff6600,0xcc33ff,0x00ffcc,0xff3399];",
  "const shopColors=[0xe63946,0x457b9d,0xf4a261,0x2a9d8f,0xe76f51,0x6d6875,0x48cae4,0xf72585];"
);

fs.writeFileSync('index.html', html);
console.log('Premium v6 applied!');
console.log('  - Antialias ON');
console.log('  - Gradient sky shader');
console.log('  - Wet reflective road');
console.log('  - Brighter exposure (1.25)');
console.log('  - Ground fog planes');
console.log('  - Bigger lamp glow orbs');
console.log('  - Glowing balloons');
console.log('  - Gray sidewalks (contrast)');
console.log('  - Brighter zebra crossings');
console.log('  - Headlight beams on player car');
console.log('  - Better shop awning colors');
