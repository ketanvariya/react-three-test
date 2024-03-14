import * as THREE from 'three';

export function addAxesHelper(threeViewer){
    let axesHelper = new THREE.AxesHelper(5);
    threeViewer.scene.add(axesHelper);
}