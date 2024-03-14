import * as THREE from 'three';

export function addBoundingBox(threeViewer) {
    // Cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    threeViewer.scene.add(cube);

    // Bounding box
    const cubeBoundingBox = new THREE.Box3().setFromObject(cube);
    const boundingBoxHelper = new THREE.Box3Helper(cubeBoundingBox, 0xffff00);
    threeViewer.scene.add(boundingBoxHelper);
}