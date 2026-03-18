const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
let changes = 0;

function rep(name, old, nw) {
  if (html.includes(old)) {
    html = html.replaceAll(old, nw);
    changes++;
    console.log('  ✅ ' + name);
  }
}

console.log('=== GPU OPTIMIZATION ===\n');

// ═══════════════════════════════════════
// STEP 1: REDUCE LIGHTS FROM 4 TO 2
// ═══════════════════════════════════════
// Remove hemisphere light
rep('Remove HemisphereLight',
  "const hemiLight=new THREE.HemisphereLight(0x87ceeb,0x4a6a50,0.5);\nscene.add(hemiLight);",
  "// HemisphereLight removed for GPU optimization"
);

// Remove moon light
rep('Remove MoonLight',
  "const moonLight=new THREE.DirectionalLight(0xaaccff,0.3);\nmoonLight.position.set(-20,40,-30);\nscene.add(moonLight);",
  "// MoonLight removed for GPU optimization"
);

// Boost remaining 2 lights to compensate
rep('Boost ambient',
  "const ambLight=new THREE.AmbientLight(0x445577,0.7);",
  "const ambLight=new THREE.AmbientLight(0x556688,0.9);"
);
rep('Boost directional',
  "const dirLight=new THREE.DirectionalLight(0xffeedd,1.3);",
  "const dirLight=new THREE.DirectionalLight(0xffeedd,1.5);"
);

// ═══════════════════════════════════════
// STEP 2: SWAP SMALL OBJECTS TO MeshPhongMaterial
// (cheaper shader - doesn't process PBR)
// ═══════════════════════════════════════

// All bench/park/sidewalk/pole/sign materials → MeshPhongMaterial
rep('Bench material',
  "const benchMat=new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0x8B5A2B});",
  "const benchMat=new THREE.MeshPhongMaterial({color:0x8B5A2B,shininess:5});"
);

rep('Park material',
  "const parkMat=new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0x1a7a40});",
  "const parkMat=new THREE.MeshPhongMaterial({color:0x1a7a40,shininess:2});"
);

rep('Sidewalk material',
  "const swMat=new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0x4a5a6a});",
  "const swMat=new THREE.MeshPhongMaterial({color:0x4a5a6a,shininess:5});"
);

rep('Pole material',
  "const poleMat=new THREE.MeshStandardMaterial({color:0x999999,roughness:0.4,metalness:0.7});",
  "const poleMat=new THREE.MeshPhongMaterial({color:0x999999,shininess:30});"
);

rep('Sign material',
  "const signMat=new THREE.MeshStandardMaterial({color:0x22c55e,emissive:0x11aa44,emissiveIntensity:0.3,roughness:0.5,metalness:0.2});",
  "const signMat=new THREE.MeshPhongMaterial({color:0x22c55e,emissive:0x11aa44,emissiveIntensity:0.3,shininess:10});"
);

// Traffic light materials → Phong
rep('TL pole',
  "const tlPoleMat=new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0x444444});",
  "const tlPoleMat=new THREE.MeshPhongMaterial({color:0x444444,shininess:5});"
);
rep('TL box',
  "const tlBoxMat=new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0x222222});",
  "const tlBoxMat=new THREE.MeshPhongMaterial({color:0x222222,shininess:5});"
);

// Crossroad/zebra materials → MeshBasicMaterial (no lighting needed for flat road)
rep('Cross road',
  "const crossMat=new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0x4a5a70});",
  "const crossMat=new THREE.MeshBasicMaterial({color:0x4a5a70});"
);
rep('Side road',
  "const sideRoadMat=new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0x3a4565});",
  "const sideRoadMat=new THREE.MeshBasicMaterial({color:0x3a4565});"
);

// Curve markers → MeshBasicMaterial
rep('Curve marker L',
  "const cmarkMatL=new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0xffcc00});",
  "const cmarkMatL=new THREE.MeshBasicMaterial({color:0xffcc00});"
);
rep('Curve marker R',
  "const cmarkMatR=new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0xffffff});",
  "const cmarkMatR=new THREE.MeshBasicMaterial({color:0xffffff});"
);

// Speed bump → Phong
rep('Speed bump',
  "const bumpMat=new THREE.MeshStandardMaterial({color:0xffdd00,emissive:0xffbb00,emissiveIntensity:0.3,roughness:0.6,metalness:0.1});",
  "const bumpMat=new THREE.MeshPhongMaterial({color:0xffdd00,emissive:0xffbb00,emissiveIntensity:0.3,shininess:10});"
);

// Arrow indicators → MeshBasicMaterial (always glowing)
rep('Arrows',
  "const arrowMat=new THREE.MeshStandardMaterial({color:0x44ff44,emissive:0x22ff22,emissiveIntensity:0.5,roughness:0.3,metalness:0.0});",
  "const arrowMat=new THREE.MeshBasicMaterial({color:0x44ff44});"
);

// Barrier → Phong
rep('Barrier',
  "const barrierMat=new THREE.MeshStandardMaterial({color:0xff6600,emissive:0xff4400,emissiveIntensity:0.3,roughness:0.6,metalness:0.1});",
  "const barrierMat=new THREE.MeshPhongMaterial({color:0xff6600,emissive:0xff4400,emissiveIntensity:0.3,shininess:5});"
);

// Red danger edges → MeshBasicMaterial
rep('Red edges',
  "const redEdgeMat=new THREE.MeshStandardMaterial({color:0xff2222,emissive:0xff1111,emissiveIntensity:0.5,roughness:0.4,metalness:0.0});",
  "const redEdgeMat=new THREE.MeshBasicMaterial({color:0xff3333});"
);

// Lamp pole → Phong
rep('Lamp pole',
  "const poleMat=new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0x888888});",
  "const poleMat=new THREE.MeshPhongMaterial({color:0x888888,shininess:20});"
);

// Star material → Basic (stars don't need lighting)
rep('Stars',
  "const starMat=new THREE.MeshStandardMaterial({color:0xffffff,emissive:0xffffff,emissiveIntensity:1.0,roughness:0.1,metalness:0.0});",
  "const starMat=new THREE.MeshBasicMaterial({color:0xffffff});"
);

// Pedestrian body → Phong
rep('Ped body',
  "const pedBodyInst=new THREE.InstancedMesh(pedBodyGeo,new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0x4488cc}),PED_N);",
  "const pedBodyInst=new THREE.InstancedMesh(pedBodyGeo,new THREE.MeshPhongMaterial({color:0x4488cc,shininess:5}),PED_N);"
);
rep('Ped head',
  "const pedHeadInst=new THREE.InstancedMesh(pedHeadGeo,new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0xffffff}),PED_N);",
  "const pedHeadInst=new THREE.InstancedMesh(pedHeadGeo,new THREE.MeshPhongMaterial({color:0xffffff,shininess:5}),PED_N);"
);

// Parked car body → keep Standard (important visual), but roof → Phong
rep('Parked roof',
  "const pCarRoofInst=new THREE.InstancedMesh(pCarRoofGeo,new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0x111111}),PARKED_N);",
  "const pCarRoofInst=new THREE.InstancedMesh(pCarRoofGeo,new THREE.MeshPhongMaterial({color:0x111111,shininess:40}),PARKED_N);"
);

// Cross traffic roof → Phong
rep('CT roof',
  "const ctRoofInst=new THREE.InstancedMesh(ctRoofGeo,new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0x111111}),CT_N);",
  "const ctRoofInst=new THREE.InstancedMesh(ctRoofGeo,new THREE.MeshPhongMaterial({color:0x111111,shininess:40}),CT_N);"
);

// Shop front glass → Basic
rep('Shop glass',
  "const shopFrontMat=new THREE.MeshStandardMaterial({color:0xffeedd,transparent:true,opacity:0.3,roughness:0.2,metalness:0.4});",
  "const shopFrontMat=new THREE.MeshBasicMaterial({color:0xffeedd,transparent:true,opacity:0.3});"
);

// Awning → Phong
rep('Awning',
  "const awningMat=new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0xffffff});",
  "const awningMat=new THREE.MeshPhongMaterial({color:0xffffff,shininess:5});"
);

// Trunk → Phong
rep('Tree trunk',
  "const trunkMat=new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0x5c4033});",
  "const trunkMat=new THREE.MeshPhongMaterial({color:0x5c4033,shininess:2});"
);

// Leaf → Phong
rep('Tree leaves',
  "const leafInst=new THREE.InstancedMesh(leafGeo,new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05}),treePositions.length);",
  "const leafInst=new THREE.InstancedMesh(leafGeo,new THREE.MeshPhongMaterial({shininess:5}),treePositions.length);"
);

// ═══════════════════════════════════════
// STEP 3: Add WebGL context lost detection
// ═══════════════════════════════════════
rep('Context lost detection',
  "document.body.prepend(renderer.domElement);",
  "document.body.prepend(renderer.domElement);\nrenderer.domElement.addEventListener('webglcontextlost',function(e){e.preventDefault();console.error('WebGL CONTEXT LOST');document.getElementById('startScreen').innerHTML='<h1 style=\"color:#ef4444;margin:20px\">GPU overloaded - refresh page</h1>'});"
);

fs.writeFileSync('index.html', html);

// Count remaining MeshStandardMaterial
const remaining = (html.match(/new THREE\.MeshStandardMaterial/g) || []).length;
const phong = (html.match(/new THREE\.MeshPhongMaterial/g) || []).length;
const basic = (html.match(/new THREE\.MeshBasicMaterial/g) || []).length;

console.log('\n=== DONE: ' + changes + ' optimizations ===');
console.log('Materials breakdown:');
console.log('  MeshStandardMaterial: ' + remaining + ' (was 73)');
console.log('  MeshPhongMaterial: ' + phong);
console.log('  MeshBasicMaterial: ' + basic);
console.log('  Lights: 2 (was 4)');
