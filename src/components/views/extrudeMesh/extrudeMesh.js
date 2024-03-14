import * as THREE from 'three';

export function extrudeInit(threeViewer){

    let plane = planeShape();
    threeViewer.scene.add(plane);

    let extrudedeMesh = extrudeShape(plane,2);
    threeViewer.scene.add(extrudedeMesh);

    //copy position, rotation and scale
    extrudedeMesh.position.copy(plane.position.clone().add(new THREE.Vector3(5, 5, 5)));
    extrudedeMesh.rotation.copy(plane.rotation);
    extrudedeMesh.scale.copy(plane.scale);

    // add to scene

}

export function planeShape() {
    console.log("hello")
    // create plane shape bt move
    let shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.lineTo(0, 10)
    shape.lineTo(10, 10)
    shape.lineTo(10, 0)
    shape.lineTo(0, 0)


    const geometry = new THREE.ShapeGeometry(shape);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const mesh = new THREE.Mesh(geometry, material);
    return mesh

}

// Function to extrude the shape
export function extrudeShape(mesh, depth) {
    // Ensure mesh is provided and is an instance of THREE.Mesh
    if (!(mesh instanceof THREE.Mesh)) {
        console.error('Invalid mesh provided for extrusion.');
        return;
    }

    // Create extrude settings
    const extrudeSettings = {
        depth: depth, // Depth of the extrusion
        bevelEnabled: false, // Enable or disable bevel
    };

    // Create extruded geometry
    const geometry = new THREE.ExtrudeGeometry(mesh.geometry.parameters.shapes, extrudeSettings);

    // Create new mesh with extruded geometry
    const extrudedMesh = new THREE.Mesh(geometry, mesh.material);
    extrudedMesh.position.copy(mesh.position); // Maintain original position
    extrudedMesh.rotation.copy(mesh.rotation); // Maintain original rotation
    extrudedMesh.scale.copy(mesh.scale); // Maintain original scale

    return extrudedMesh;
}

export function planeMesh() {
    let planeGeometry = new THREE.PlaneGeometry(10, 10);
    let planeMaterial = new THREE.MeshBasicMaterial({ color: "red" });
    let planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    return planeMesh
}