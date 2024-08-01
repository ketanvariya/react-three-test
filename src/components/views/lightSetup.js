import * as THREE from 'three';

export async function addLights(scene, camera, threeViewer) {

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight1.position.set(0, 7, -22.174)
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(0, -22.465, 0)
    const directionalLight3  = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight3.position.set(0, 25.454, 0)
    scene.add(directionalLight1, directionalLight2, directionalLight3)

    // let filePath = `${process.env.REACT_APP_HomePage}assets/three/hdr/studio_small_08.hdr`
    // await loadENV(filePath,threeViewer)  


}