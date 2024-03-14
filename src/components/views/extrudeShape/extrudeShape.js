import * as THREE from "three";


function createExtrudeShape(){
    // create rectangle shape in threejs 
    var rectangleShape = new THREE.Shape();
    rectangleShape.moveTo(0, 0);
    rectangleShape.lineTo(0, 10);
    rectangleShape.lineTo(10, 10);
    rectangleShape.lineTo(10, 0);
    rectangleShape.lineTo(0, 0);
    
    let grometry = new THREE.ShapeGeometry(rectangleShape);
    let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var rectangleMesh = new THREE.Mesh(grometry, material);
    rectangleMesh.name = "rectangleMesh";
    return rectangleMesh
}

export function extrudeShape(threeViewer){
    let shape = createExtrudeShape();
    threeViewer.scene.add(shape);

}