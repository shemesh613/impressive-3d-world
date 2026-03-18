const fs = require('fs');
const path = require('path');
let c = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
c = c.replace(/\r\n/g, '\n');

let changes = 0;
function rep(old, nw, label) {
  if (c.includes(old)) { c = c.replace(old, nw); changes++; console.log('OK: ' + label); }
  else console.log('MISS: ' + label);
}

// 1. Add roadY function
rep(
  'function roadX(z){return Math.sin(z*.007)*4.5+Math.sin(z*.019)*2.5}',
  'function roadX(z){return Math.sin(z*.007)*4.5+Math.sin(z*.019)*2.5}\nfunction roadY(z){return Math.sin(z*.012)*3+Math.sin(z*.025)*1.5}',
  'add roadY'
);

// 2. Ground plane lower
rep(
  "new THREE.PlaneGeometry(400,2000),new THREE.MeshBasicMaterial({color:0x1a2a3a}));m.rotation.x=-Math.PI/2;return m",
  "new THREE.PlaneGeometry(400,2000),new THREE.MeshBasicMaterial({color:0x1a2a3a}));m.rotation.x=-Math.PI/2;m.position.y=-5;return m",
  'ground lower'
);

// 3. Road segments
rep(
  'const z=-100+i*SEG_LEN,x=roadX(z+SEG_LEN/2);',
  'const z=-100+i*SEG_LEN,x=roadX(z+SEG_LEN/2),hy=roadY(z+SEG_LEN/2),hslope=Math.atan2(roadY(z+SEG_LEN)-roadY(z),SEG_LEN);',
  'road seg vars'
);
rep(
  'dummy.rotation.set(-Math.PI/2,0,0);dummy.scale.setScalar(1);\n    dummy.position.set(x,.01,z+SEG_LEN/2);',
  'dummy.rotation.set(-Math.PI/2+hslope,0,0);dummy.scale.setScalar(1);\n    dummy.position.set(x,hy+.01,z+SEG_LEN/2);',
  'road seg rotation+pos'
);
// Edge and glow positions - replace .02 and .005 with hy+offset
rep('dummy.position.set(x-5.2,.02,z+SEG_LEN/2)', 'dummy.position.set(x-5.2,hy+.02,z+SEG_LEN/2)', 'edgeL');
rep('dummy.position.set(x+5.2,.02,z+SEG_LEN/2)', 'dummy.position.set(x+5.2,hy+.02,z+SEG_LEN/2)', 'edgeR');
rep('dummy.position.set(x-6.8,.005,z+SEG_LEN/2)', 'dummy.position.set(x-6.8,hy+.005,z+SEG_LEN/2)', 'glowL');
rep('dummy.position.set(x+6.8,.005,z+SEG_LEN/2)', 'dummy.position.set(x+6.8,hy+.005,z+SEG_LEN/2)', 'glowR');

// 4. Road marks
rep(
  'dummy.position.set(roadX(z),.03,z);',
  'dummy.position.set(roadX(z),roadY(z)+.03,z);',
  'road marks'
);

// Can't easily find road marks since the var name might differ. Let me check.
// Actually looking at grep output, line 397 uses: dummy.position.set(roadX(_z),.03,_z)
rep(
  'dummy.position.set(roadX(_z),.03,_z);',
  'dummy.position.set(roadX(_z),roadY(_z)+.03,_z);',
  'road marks v2'
);

// 5. Intersections
rep(
  'const z=60+i*80,x=roadX(z);',
  'const z=60+i*80,x=roadX(z),ihy=roadY(z);',
  'intersection vars'
);
rep(
  'dummy.position.set(x,.012,z);',
  'dummy.position.set(x,ihy+.012,z);',
  'intersection pos'
);
rep(
  'dummy.position.set(x-4.5+j*1,0.025,z);',
  'dummy.position.set(x-4.5+j*1,ihy+0.025,z);',
  'zebra pos'
);

// 6. Car movement - add Y tracking after position update
rep(
  'car.position.x+=Math.sin(dir)*spd;\n    car.position.z+=Math.cos(dir)*spd;',
  'car.position.x+=Math.sin(dir)*spd;\n    car.position.z+=Math.cos(dir)*spd;\n    car.position.y=roadY(car.position.z);\n    const hillSlope=Math.atan2(roadY(car.position.z+2)-roadY(car.position.z-2),4);\n    car.rotation.x=-hillSlope;',
  'car Y + pitch'
);

// 7. Camera
rep(
  '_cv.set(window._camX-Math.sin(dir+cTh)*14,7+cPh*4,car.position.z-Math.cos(dir+cTh)*14);',
  'const _hillCamY=roadY(car.position.z);\n  _cv.set(window._camX-Math.sin(dir+cTh)*14,_hillCamY+7+cPh*4,car.position.z-Math.cos(dir+cTh)*14);',
  'camera Y'
);

// 8. Follower cars
rep(
  'dummy.position.set(followerPos[i].x,visible?followerPos[i].y:-100,followerPos[i].z);',
  'dummy.position.set(followerPos[i].x,visible?roadY(followerPos[i].z)+followerPos[i].y:-100,followerPos[i].z);',
  'followers Y'
);

// 9. Green collectibles bobbing  
rep(
  'for(let i=0;i<greens.length;i++){greens[i].y=3+Math.sin(fc*.05+i)*.5}',
  'for(let i=0;i<greens.length;i++){greens[i].y=roadY(greens[i].z)+3+Math.sin(fc*.05+i)*.5}',
  'greens bob Y'
);

// 10. Powerups bobbing
rep(
  'for(let i=0;i<powerups.length;i++){powerups[i].y=2.5+Math.sin(fc*.06+i)*.6}',
  'for(let i=0;i<powerups.length;i++){powerups[i].y=roadY(powerups[i].z)+2.5+Math.sin(fc*.06+i)*.6}',
  'powerups bob Y'
);

// 11. Obstacles - need to add roadY. Find where obstacles y is set.
// Obstacles don't have a bob loop, their y=.7 is set at spawn. Let me add terrain in updateInstances.
// Actually, let me add a simple line after the powerups bobbing to update obstacle Y:
rep(
  'for(let i=0;i<powerups.length;i++){powerups[i].y=roadY(powerups[i].z)+2.5+Math.sin(fc*.06+i)*.6}',
  'for(let i=0;i<powerups.length;i++){powerups[i].y=roadY(powerups[i].z)+2.5+Math.sin(fc*.06+i)*.6}\n    for(let i=0;i<obstacles.length;i++){obstacles[i].y=roadY(obstacles[i].z)+.7}',
  'obstacles Y'
);

// 12. startGame car position
rep(
  'car.position.set(0,0,0);',
  'car.position.set(0,roadY(0),0);',
  'startGame car Y'
);

// 13. Beam/ring effects on greens - they sit at ground level, need roadY
// beam: dummy.position.set(greens[i].x,1.5,greens[i].z)
rep(
  'dummy.position.set(greens[i].x,1.5,greens[i].z)',
  'dummy.position.set(greens[i].x,roadY(greens[i].z)+1.5,greens[i].z)',
  'beam Y'
);
// ring: dummy.position.set(greens[i].x,0.1,greens[i].z)
rep(
  'dummy.position.set(greens[i].x,0.1,greens[i].z)',
  'dummy.position.set(greens[i].x,roadY(greens[i].z)+0.1,greens[i].z)',
  'ring Y'
);
// obs ring: dummy.position.set(obstacles[i].x,0.1,obstacles[i].z)
rep(
  'dummy.position.set(obstacles[i].x,0.1,obstacles[i].z)',
  'dummy.position.set(obstacles[i].x,roadY(obstacles[i].z)+0.1,obstacles[i].z)',
  'obsRing Y'
);

// 14. Curve markers at ground level
rep(
  "dummy.position.set(-5+curve,0.02,z);",
  "dummy.position.set(-5+curve,roadY(z)+0.02,z);",
  'curveMarkerL'
);
rep(
  "dummy.position.set(5+curve,0.02,z);",
  "dummy.position.set(5+curve,roadY(z)+0.02,z);",
  'curveMarkerR'
);

// 15. Pedestrians
rep(
  'dummy.position.set(p.x,0.5+bob,p.z)',
  'dummy.position.set(p.x,roadY(p.z)+0.5+bob,p.z)',
  'ped body Y'
);
rep(
  'dummy.position.set(p.x,1.1+bob,p.z)',
  'dummy.position.set(p.x,roadY(p.z)+1.1+bob,p.z)',
  'ped head Y'
);

// 16. Oncoming traffic
rep(
  'dummy.position.set(o.x,0.6,o.z);dummy.scale.setScalar(1);dummy.rotation.set(0,Math.PI,0)',
  'dummy.position.set(o.x,roadY(o.z)+0.6,o.z);dummy.scale.setScalar(1);dummy.rotation.set(0,Math.PI,0)',
  'oncoming body Y'
);
rep(
  'dummy.position.set(o.x,1.15,o.z)',
  'dummy.position.set(o.x,roadY(o.z)+1.15,o.z)',
  'oncoming roof Y'
);

// Restore line endings
c = c.replace(/\n/g, '\r\n');
fs.writeFileSync(path.join(__dirname, 'index.html'), c);
console.log('\nTotal changes: ' + changes);
const roadYcount = (c.match(/roadY/g) || []).length;
console.log('roadY occurrences: ' + roadYcount);
