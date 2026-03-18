const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Windows brighter
html = html.replace(
  "const mat=new THREE.MeshStandardMaterial({color:0xffeecc,emissive:0xffdd88,emissiveIntensity:0.6,roughness:0.2,metalness:0.0});",
  "const mat=new THREE.MeshStandardMaterial({color:0xffeeaa,emissive:0xffcc44,emissiveIntensity:2.0,roughness:0.05,metalness:0.0});"
);

// 2. More windows
html = html.replace(
  "if(Math.random()>.4)wp.push(b[0]+x*.7,y*1.3+1.5,b[1]+b[4]/2+.01)",
  "if(Math.random()>.2)wp.push(b[0]+x*.8,y*1.2+1.2,b[1]+b[4]/2+.01)"
);

// 3. Bigger window planes
html = html.replace(
  "const n=wp.length/3;const geo=new THREE.PlaneGeometry(.35,.35);",
  "const n=wp.length/3;const geo=new THREE.PlaneGeometry(.55,.7);"
);

// 4. Wider road glow
html = html.replace(
  "const glowGeo=new THREE.PlaneGeometry(2.5,SLEN);",
  "const glowGeo=new THREE.PlaneGeometry(3.5,SLEN);"
);
html = html.replace(
  "const glowMat=new THREE.MeshStandardMaterial({color:0x0d3320,emissive:0x115530,emissiveIntensity:0.25,roughness:0.6,metalness:0.0});",
  "const glowMat=new THREE.MeshStandardMaterial({color:0x0d3320,emissive:0x115530,emissiveIntensity:0.35,roughness:0.5,metalness:0.0});"
);

// 5. Brighter road edges
html = html.replace(
  "const edgeMat=new THREE.MeshStandardMaterial({color:0x22c55e,emissive:0x22c55e,emissiveIntensity:0.4,roughness:0.5,metalness:0.1});",
  "const edgeMat=new THREE.MeshStandardMaterial({color:0x22c55e,emissive:0x22c55e,emissiveIntensity:0.7,roughness:0.3,metalness:0.1});"
);

// 6. Random tree colors
html = html.replace(
  "leafInst.setColorAt(i,_col.setHex(leafColors[i%leafColors.length]));",
  "leafInst.setColorAt(i,_col.setHex(leafColors[Math.floor(Math.random()*leafColors.length)]));"
);

// 7. More tree colors
html = html.replace(
  "const leafColors=[0x16a34a,0x22c55e,0x15803d,0x4ade80,0x86efac];",
  "const leafColors=[0x16a34a,0x22c55e,0x15803d,0xd4a030,0xc05020,0x8a6a3a,0x2d8a4e,0x1a6a3a,0x6aaa3a];"
);

// 8. Better leaf material
html = html.replace(
  "const leafInst=new THREE.InstancedMesh(leafGeo,new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05}),treePositions.length);",
  "const leafInst=new THREE.InstancedMesh(leafGeo,new THREE.MeshStandardMaterial({roughness:0.6,metalness:0.0}),treePositions.length);"
);

// 9. Urban biome colors
html = html.replace(
  "const biomes=[[0x22c55e,0x10b981,0x059669,0x34d399],[0xd4a054,0xb8860b,0xcd853f,0xdeb887],[0x6495ed,0x4169e1,0x87ceeb,0xb0c4de],[0xcd5c5c,0xb22222,0xdc143c,0xe9967a],[0x9370db,0x8a2be2,0xba55d3,0xdda0dd]];",
  "const biomes=[[0x4a6a7a,0x5a7a8a,0x3a5a6a,0x6a8a9a],[0x7a6a5a,0x8a7a6a,0x6a5a4a,0x9a8a7a],[0x5a5a7a,0x6a6a8a,0x4a4a6a,0x7a7a9a],[0x6a7a6a,0x7a8a7a,0x5a6a5a,0x8a9a8a],[0x8a6a7a,0x9a7a8a,0x7a5a6a,0xa0809a],[0x5a7a9a,0x6a8aaa,0x4a6a8a,0x7a9aba],[0x9a8a6a,0xaa9a7a,0x8a7a5a,0xbaa090]];"
);

// 10. Shorter biome transitions
html = html.replace(
  "function biomeColor(z,i){const idx=((Math.floor(z/500)%biomes.length)+biomes.length)%biomes.length;",
  "function biomeColor(z,i){const idx=((Math.floor(z/180)%biomes.length)+biomes.length)%biomes.length;"
);

// 11. Less fog
html = html.replace(
  "scene.fog=new THREE.FogExp2(0x0a1628,.0018);",
  "scene.fog=new THREE.FogExp2(0x0a1628,.0010);"
);

// 12. Better directional light balance
html = html.replace(
  "const dirLight=new THREE.DirectionalLight(0xffeedd,0.8);",
  "const dirLight=new THREE.DirectionalLight(0xffeedd,1.1);"
);
html = html.replace(
  "const ambLight=new THREE.AmbientLight(0x334466,0.6);",
  "const ambLight=new THREE.AmbientLight(0x334466,0.45);"
);

// 13. Exposure boost
html = html.replace(
  "renderer.toneMappingExposure=1.1;",
  "renderer.toneMappingExposure=1.25;"
);

// 14. Gray sidewalks
html = html.replace(
  "const swMat=new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0x2a6a4e});",
  "const swMat=new THREE.MeshStandardMaterial({roughness:0.8,metalness:0.05,color:0x4a5a6a});"
);

// 15. Wet road
html = html.replace(
  "new THREE.PlaneGeometry(11,SLEN),new THREE.MeshStandardMaterial({color:0x2a3050,roughness:0.85,metalness:0.1})",
  "new THREE.PlaneGeometry(11,SLEN),new THREE.MeshStandardMaterial({color:0x2a3050,roughness:0.55,metalness:0.25})"
);

// 16. Bigger lamp glow
html = html.replace(
  "const glowGeo=new THREE.SphereGeometry(.25,4,4);",
  "const glowGeo=new THREE.SphereGeometry(.4,6,6);"
);

// 17. Better shop colors
html = html.replace(
  "const shopColors=[0xff3366,0x33ccff,0xffcc00,0x66ff33,0xff6600,0xcc33ff,0x00ffcc,0xff3399];",
  "const shopColors=[0xe63946,0x457b9d,0xf4a261,0x2a9d8f,0xe76f51,0x6d6875,0x48cae4,0xf72585];"
);

// 18. More stars
html = html.replace("const STAR_N=80;", "const STAR_N=150;");

// 19. Zebra glow
html = html.replace(
  "const zebraMat=new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0xffffcc});",
  "const zebraMat=new THREE.MeshStandardMaterial({roughness:0.6,metalness:0.05,color:0xffffdd,emissive:0xffffaa,emissiveIntensity:0.15});"
);

// 20. Darker trunk
html = html.replace(
  "const trunkMat=new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0x5c4033});",
  "const trunkMat=new THREE.MeshStandardMaterial({roughness:0.85,metalness:0.0,color:0x4a3020});"
);

fs.writeFileSync('index.html', html);
console.log('Safe v8 applied - no shader, no PointLights, no antialias change!');
