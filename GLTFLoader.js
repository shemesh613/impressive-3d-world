// Minimal GLTFLoader for THREE.js (global build) - loads GLB files
(function(){
THREE.GLTFLoader = function(manager){
  this.manager = manager || THREE.DefaultLoadingManager;
};
THREE.GLTFLoader.prototype = {
  load: function(url, onLoad, onProgress, onError){
    var scope = this;
    fetch(url).then(function(r){return r.arrayBuffer()}).then(function(buf){
      scope.parse(buf, '', onLoad, onError);
    }).catch(function(e){if(onError)onError(e)});
  },
  parse: function(data, path, onLoad, onError){
    try{
      var dv = new DataView(data);
      // GLB header
      if(dv.getUint32(0,true)!==0x46546C67){throw new Error('Not a GLB file')}
      var jsonLen = dv.getUint32(12,true);
      var jsonStr = new TextDecoder().decode(new Uint8Array(data,20,jsonLen));
      var json = JSON.parse(jsonStr);
      // Binary chunk
      var binOff = 20+jsonLen+8;
      var binData = data.slice(binOff);
      // Parse meshes
      var group = new THREE.Group();
      var bufferViews = json.bufferViews||[];
      var accessors = json.accessors||[];
      var materials = (json.materials||[]).map(function(m){
        var c = m.pbrMetallicRoughness||{};
        var bc = c.baseColorFactor||[0.5,0.5,0.5,1];
        return new THREE.MeshStandardMaterial({
          color: new THREE.Color(bc[0],bc[1],bc[2]),
          roughness: c.roughnessFactor!==undefined?c.roughnessFactor:0.5,
          metalness: c.metallicFactor!==undefined?c.metallicFactor:0.5,
          transparent: bc[3]<1, opacity: bc[3]
        });
      });
      if(!materials.length)materials.push(new THREE.MeshStandardMaterial({color:0x888888}));
      function getAccessorData(accIdx){
        var acc = accessors[accIdx];
        var bv = bufferViews[acc.bufferView];
        var off = (bv.byteOffset||0)+(acc.byteOffset||0);
        var count = acc.count;
        var compType = acc.componentType;
        var type = acc.type;
        var numComp = {SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT4:16}[type]||1;
        if(compType===5126) return new Float32Array(binData,off,count*numComp);
        if(compType===5123) return new Uint16Array(binData,off,count*numComp);
        if(compType===5125) return new Uint32Array(binData,off,count*numComp);
        return new Float32Array(binData,off,count*numComp);
      }
      (json.meshes||[]).forEach(function(mesh){
        (mesh.primitives||[]).forEach(function(prim){
          var geo = new THREE.BufferGeometry();
          if(prim.attributes.POSITION!==undefined){
            geo.setAttribute('position',new THREE.BufferAttribute(getAccessorData(prim.attributes.POSITION),3));
          }
          if(prim.attributes.NORMAL!==undefined){
            geo.setAttribute('normal',new THREE.BufferAttribute(getAccessorData(prim.attributes.NORMAL),3));
          }
          if(prim.indices!==undefined){
            var idx = getAccessorData(prim.indices);
            geo.setIndex(new THREE.BufferAttribute(idx instanceof Uint16Array?idx:new Uint16Array(idx),1));
          }
          var mat = materials[prim.material||0]||materials[0];
          group.add(new THREE.Mesh(geo,mat));
        });
      });
      // Apply node transforms
      (json.nodes||[]).forEach(function(node){
        if(node.translation)group.position.fromArray(node.translation);
        if(node.scale)group.scale.fromArray(node.scale);
      });
      if(onLoad)onLoad({scene:group});
    }catch(e){
      console.warn('GLB parse error:',e);
      if(onError)onError(e);
    }
  }
};
})();
