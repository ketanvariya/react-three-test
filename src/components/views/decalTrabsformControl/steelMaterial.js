import * as THREE from "three";


const steelMaterial = (colorObject, texture = null) => {
    const material = new THREE.MeshStandardMaterial({
        transparent: true,
        alphaTest: 0.5,
        polygonOffset: true,
        polygonOffsetFactor: - 2,
        map: texture,
        roughness: colorObject.materialValues.roughness,//3, //3
        metalness: colorObject.materialValues.metalness,//isLight ? 0.25 : 0.8,
        roughnessMap: new THREE.TextureLoader().load("assets/img/textures/metal&roughness.jpg"),
        metalnessMap: new THREE.TextureLoader().load("assets/img/textures/metal&roughness.jpg"),
        normalMap: new THREE.TextureLoader().load("assets/img/textures/normal.jpg"),
        //emissive: parseInt(colorObject.materailValues.color,16),
        //emissive: 0x000000,
        
        color: parseInt(colorObject.materialValues.color,16)//isLight ? 0x777777 : 0xeeeeee
        //color: isLight ? 0xff0000 : 0x00ff00
        
        //bumpMap: texture,//new THREE.TextureLoader().load("assets/img/textures/bump.jpg"),
        //bumpScale: -1, // Adjust the bump scale as needed
    })
    
    return material
    
}
export default steelMaterial;