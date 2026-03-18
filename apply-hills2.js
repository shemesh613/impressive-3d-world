const fs = require('fs');
let c = fs.readFileSync(__dirname + '/index.html', 'utf8');
// Normalize to \n for replacements, restore \r\n at end
c = c.replace(/\r\n/g, '\n');

// 1. Add roadY function after roadX
c = c.replace(
  'function roadX(z){return Math.sin(z*.007)*4.5+Math.sin(z*.019)*2.5}',
  'function roadX(z){return Math.sin(z*.007)*4.5+Math.sin(z*.019)*2.5}\nfunction roadY(z){return Math.sin(z*.012)*3+Math.sin(z*.025)*1.5}'
);

// 2. Road segments: add y and slope
c = c.replace(
  'const z=-100+i*SEG_LEN,x=roadX(z+SEG_LEN/2);',
  'const z=-100+i*SEG_LEN,x=roadX(z+SEG_LEN/2),y=roadY(z+SEG_LEN/2),slope=Math.atan2(roadY(z+SEG_LEN)-roadY(z),SEG_LEN);'
);
c = c.replace(
  'dummy.rotation.set(-Math.PI/2,0,0);dummy.scale.setScalar(1);\n    dummy.position.set(x,.01,z+SEG_LEN/2);',
  'dummy.rotation.set(-Math.PI/2+slope,0,0);dummy.scale.setScalar(1);\n    dummy.position.set(x,y+.01,z+SEG_LEN/2);'
);
c = c.replace(
  'dummy.position.set(x-5.2,.02,z+SEG_LEN/2);dummy.updateMatrix();edgeInstL.setMatrixAt(i,dummy.matrix);\n    dummy.position.set(x+5.2,.02,z+SEG_LEN/2);dummy.updateMatrix();edgeInstR.setMatrixAt(i,dummy.matrix);\n    dummy.position.set(x-6.8,.005,z+SEG_LEN/2);dummy.updateMatrix();glowInstL.setMatrixAt(i,dummy.matrix);\n    dummy.position.set(x+6.8,.005,z+SEG_LEN/2);dummy.updateMatrix();glowInstR.setMatrixAt(i,dummy.matrix);',
  'dummy.position.set(x-5.2,y+.02,z+SEG_LEN/2);dummy.updateMatrix();edgeInstL.setMatrixAt(i,dummy.matrix);\n    dummy.position.set(x+5.2,y+.02,z+SEG_LEN/2);dummy.updateMatrix();edgeInstR.setMatrixAt(i,dummy.matrix);\n    dummy.position.set(x-6.8,y+.005,z+SEG_LEN/2);dummy.updateMatrix();glowInstL.setMatrixAt(i,dummy.matrix);\n    dummy.position.set(x+6.8,y+.005,z+SEG_LEN/2);dummy.updateMatrix();glowInstR.setMatrixAt(i,dummy.matrix);'
);

// 3. Road marks: add y
c = c.replace(
  'dummy.position.set(roadX(z),.03,z);',
  'dummy.position.set(roadX(z),roadY(z)+.03,z);'
);

// 4. Intersections: add y
c = c.replace(
  'const z=60+i*80,x=roadX(z);',
  'const z=60+i*80,x=roadX(z),iy=roadY(z);'
);
c = c.replace(
  'dummy.position.set(x,.012,z);dummy.updateMatrix();crossInst.setMatrixAt(i,dummy.matrix);',
  'dummy.position.set(x,iy+.012,z);dummy.updateMatrix();crossInst.setMatrixAt(i,dummy.matrix);'
);
c = c.replace(
  'dummy.position.set(x-4.5+j*1,0.025,z);',
  'dummy.position.set(x-4.5+j*1,iy+0.025,z);'
);

// 5. Buildings: adjust base y
c = c.replace(
  "bdata.push([rx-11,z,2.5+Math.random()*2,4+Math.random()*12,2.5+Math.random()*2]);\n  bdata.push([rx+11,z,2.5+Math.random()*2,4+Math.random()*12,2.5+Math.random()*2]);\n  if(Math.random()>.5)bdata.push([rx-17,z,2+Math.random()*2,3+Math.random()*8,2+Math.random()*2]);\n  if(Math.random()>.5)bdata.push([rx+17,z,2+Math.random()*2,3+Math.random()*8,2+Math.random()*2]);",
  "bdata.push([rx-11,z,2.5+Math.random()*2,4+Math.random()*12,2.5+Math.random()*2,roadY(z)]);\n  bdata.push([rx+11,z,2.5+Math.random()*2,4+Math.random()*12,2.5+Math.random()*2,roadY(z)]);\n  if(Math.random()>.5)bdata.push([rx-17,z,2+Math.random()*2,3+Math.random()*8,2+Math.random()*2,roadY(z)]);\n  if(Math.random()>.5)bdata.push([rx+17,z,2+Math.random()*2,3+Math.random()*8,2+Math.random()*2,roadY(z)]);"
);
c = c.replace(
  'dummy.position.set(b[0],b[3]/2,b[1]);',
  'dummy.position.set(b[0],(b[5]||0)+b[3]/2,b[1]);'
);

// 6. Trees: adjust base y
c = c.replace(
  "if(Math.random()>.3)treeData.push([rx-8-Math.random()*6,z]);\n    if(Math.random()>.3)treeData.push([rx+8+Math.random()*6,z]);",
  "if(Math.random()>.3)treeData.push([rx-8-Math.random()*6,z,roadY(z)]);\n    if(Math.random()>.3)treeData.push([rx+8+Math.random()*6,z,roadY(z)]);"
);
c = c.replace(
  'dummy.position.set(t[0],1,t[1]);dummy.scale.setScalar(1);dummy.rotation.set(0,0,0);dummy.updateMatrix();\n    trunkInst.setMatrixAt(i,dummy.matrix);',
  'dummy.position.set(t[0],(t[2]||0)+1,t[1]);dummy.scale.setScalar(1);dummy.rotation.set(0,0,0);dummy.updateMatrix();\n    trunkInst.setMatrixAt(i,dummy.matrix);'
);
c = c.replace(
  'dummy.position.set(t[0],2.5+Math.random()*.5,t[1]);',
  'dummy.position.set(t[0],(t[2]||0)+2.5+Math.random()*.5,t[1]);'
);

// 7. Street lamps: adjust base y
c = c.replace(
  "for(let z=-50;z<=600;z+=20){const rx=roadX(z);lampData.push([rx-6,z]);lampData.push([rx+6,z])}",
  "for(let z=-50;z<=600;z+=20){const rx=roadX(z);const ly=roadY(z);lampData.push([rx-6,z,ly]);lampData.push([rx+6,z,ly])}"
);
c = c.replace(
  'dummy.position.set(l[0],2,l[1]);dummy.scale.setScalar(1);dummy.rotation.set(0,0,0);dummy.updateMatrix();\n    poleInst.setMatrixAt(i,dummy.matrix);\n    dummy.position.set(l[0],4.1,l[1]);',
  'dummy.position.set(l[0],(l[2]||0)+2,l[1]);dummy.scale.setScalar(1);dummy.rotation.set(0,0,0);dummy.updateMatrix();\n    poleInst.setMatrixAt(i,dummy.matrix);\n    dummy.position.set(l[0],(l[2]||0)+4.1,l[1]);'
);

// 8. Car movement: set y from terrain + pitch
c = c.replace(
  "car.rotation.y=dir;\n    car.position.x+=Math.sin(dir)*spd;\n    car.position.z+=Math.cos(dir)*spd;",
  "car.rotation.y=dir;\n    car.position.x+=Math.sin(dir)*spd;\n    car.position.z+=Math.cos(dir)*spd;\n    car.position.y=roadY(car.position.z);\n    const terrainSlope=Math.atan2(roadY(car.position.z+2)-roadY(car.position.z-2),4);\n    car.rotation.x=-terrainSlope;"
);

// 9. Follower cars: use roadY
c = c.replace(
  'dummy.position.set(followerPos[i].x,followerPos[i].y,followerPos[i].z);',
  'dummy.position.set(followerPos[i].x,roadY(followerPos[i].z)+followerPos[i].y,followerPos[i].z);'
);

// 10. Collectible/obstacle/powerup spawn: use roadY
c = c.replace(
  'greens.push({x,z,y:1.2,active:true});',
  'greens.push({x,z,y:1.2,baseY:roadY(z),active:true});'
);
c = c.replace(
  'obstacles.push({x,z,y:.7,active:true});',
  'obstacles.push({x,z,y:.7,baseY:roadY(z),active:true});'
);
c = c.replace(
  "powerups.push({x,z,y:1.5,active:true,type:Math.random()>.5?'shield':'turbo'});",
  "powerups.push({x,z,y:1.5,baseY:roadY(z),active:true,type:Math.random()>.5?'shield':'turbo'});"
);

// 11. Update bobbing to include baseY + obstacles y
c = c.replace(
  'for(let i=0;i<greens.length;i++){greens[i].y=1+Math.sin(fc*.05+i)*.3}',
  'for(let i=0;i<greens.length;i++){greens[i].y=(greens[i].baseY||0)+1+Math.sin(fc*.05+i)*.3}\n    for(let i=0;i<obstacles.length;i++){obstacles[i].y=(obstacles[i].baseY||0)+.7}'
);
c = c.replace(
  'for(let i=0;i<powerups.length;i++){powerups[i].y=1.5+Math.sin(fc*.06+i)*.4}',
  'for(let i=0;i<powerups.length;i++){powerups[i].y=(powerups[i].baseY||0)+1.5+Math.sin(fc*.06+i)*.4}'
);

// 12. Camera: use roadY for height
c = c.replace(
  '_cv.set(car.position.x-Math.sin(dir+cTh)*14,7+cPh*4,car.position.z-Math.cos(dir+cTh)*14);',
  'const camTY=roadY(car.position.z);\n  _cv.set(car.position.x-Math.sin(dir+cTh)*14,camTY+7+cPh*4,car.position.z-Math.cos(dir+cTh)*14);'
);

// 13. Ground plane lower
c = c.replace(
  "const m=new THREE.Mesh(new THREE.PlaneGeometry(400,2000),new THREE.MeshBasicMaterial({color:0x1a2a3a}));m.rotation.x=-Math.PI/2;",
  "const m=new THREE.Mesh(new THREE.PlaneGeometry(400,2000),new THREE.MeshBasicMaterial({color:0x1a2a3a}));m.rotation.x=-Math.PI/2;m.position.y=-5;"
);

// Restore \r\n
c = c.replace(/\n/g, '\r\n');
fs.writeFileSync(__dirname + '/index.html', c);

// Verify
const count = (c.match(/roadY/g) || []).length;
console.log('Done! roadY appears ' + count + ' times.');
