import * as THREE from 'three';
var threeViewer = undefined
export function initRaycastTest(inViewer){

    console.log("helloT")
    threeViewer = inViewer
    let group = new THREE.Group()
    // Add cube
    let cube = createCube("cube1")
    group.add(cube)
    let cube2 = cube.clone()
    group.add(cube2)
    cube2.name = "cube2"
    cube2.position.x = 5
    threeViewer.scene.add(group)
    // threeViewer.scene.add(cube2)

    // Add raycaster event on click 
    threeViewer.renderer.domElement.addEventListener('click', (event) => {
        rayCastTheEvent(event)
    })
}

function createCube(name){
    // create cube in threejs 
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    if (name) cube.name = name
    else cube.name = "cube"
    return cube
}

function rayCastTheEvent(event) {
    // create raycast
    const raycaster = new THREE.Raycaster();
    
    // Set the raycaster position based on the mouse event
    threeViewer.mouse.x = ((event.clientX - (threeViewer.element.getBoundingClientRect().left)) / threeViewer.element.clientWidth) * 2 - 1;
    threeViewer.mouse.y = - ((event.clientY - (threeViewer.element.getBoundingClientRect().top)) / threeViewer.element.clientHeight) * 2 + 1;

    console.log(threeViewer.mouse.x, "mouseX", event.clientX, "clientX")

    raycaster.setFromCamera(threeViewer.mouse, threeViewer.camera);
    // Perform raycasting on objects
    const intersects = raycaster.intersectObjects(threeViewer.scene.children, true);
    // Handle intersection results
    if (intersects.length > 0) {
        // Perform actions based on intersection
        console.log("Intersection detected:", intersects[0]);
    }
}
