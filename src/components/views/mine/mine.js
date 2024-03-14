import * as THREE from "three";
import { createOpenEndCube } from "../utils/objectCreateUtils/objectCreateUtils";

export function initMine(threeViewer){

    let cube = createOpenEndCube(3, 3, 7);
    // make it x oriented
    cube.rotation.x = Math.PI / 2;
    threeViewer.scene.add(cube);

    // create bounding box 
    let boundingBox = new THREE.Box3().setFromObject(cube);
    //add 
    threeViewer.scene.add(boundingBox);

}

