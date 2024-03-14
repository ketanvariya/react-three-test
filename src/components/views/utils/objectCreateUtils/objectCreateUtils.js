import * as THREE from "three";

export function createOpenEndCube(inX, inY, inZ) {
    // we can not set width
    // width and length will be same
    const geometry = new THREE.CylinderGeometry(inX, inY, inZ, 4, undefined, true);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
    let cylinder = new THREE.Mesh(geometry, material);;
    cylinder.name = "openEndedCylinder"

    return cylinder

}
export function createOpenCubeGeometry(width, height, depth) {
    var geometry = new THREE.BufferGeometry();

    // Vertices
    var vertices = new Float32Array([
        -width / 2, -height / 2, -depth / 2,  // 0
        width / 2, -height / 2, -depth / 2,  // 1
        width / 2, height / 2, -depth / 2,  // 2
        -width / 2, height / 2, -depth / 2,  // 3
        -width / 2, -height / 2, depth / 2,  // 4
        width / 2, -height / 2, depth / 2,  // 5
        width / 2, height / 2, depth / 2,  // 6
        -width / 2, height / 2, depth / 2   // 7
    ]);

    // Indices
    var indices = new Uint32Array([
        0, 1, 2, 2, 3, 0, // Front
        1, 5, 6, 6, 2, 1, // Right
        4, 0, 3, 3, 7, 4, // Left
        5, 4, 7, 7, 6, 5  // Back
    ]);

    geometry.setIndex(indices);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    return geometry;
}



