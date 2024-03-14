
import visualize from "../common/visualize";
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'

import {
    Color,
    Mesh,
    MeshStandardMaterial,
    Group
} from 'three';
import * as THREE from 'three'
import { DCShape } from "../threeCustom/DCShape";
import { environmentVariable } from "../variables";

export const addShapeToSceneNew = (openCascade, shape, color = undefined, facesColor, parent, inName, inMat = undefined, inSequenceName, layer = 1) => {

    let geometries = visualize(openCascade, shape, layer, color);

    let shape3js = new DCShape();
    let faces = geometries[0]
    for (let i = 0; i < faces.length; i++) {
        let f = faces[i];
        shape3js.addFace(f);
        f.sequenceFaceName = `${i}_${inSequenceName}`
    }
    shape3js.layers.set(layer)
    shape3js.name = inName;

    let hexColor = environmentVariable.modelColor
    if (color) {
        hexColor = color.getHex()
    }
    if (shape3js) {
        let allFaces = shape3js.getAllFaces()
        for (let i = 0; i < allFaces.length; i++) {
            let face = allFaces[i];
            face.material.color.set(facesColor[i] ? facesColor[i] : hexColor)
            face.material.metalness = 0.5
            face.material.roughness = 0.8
            face.material.originalColor = face.material.color.clone()
        }
    }
    parent.add(shape3js)
    if (inMat){
        shape3js.applyMatrix4(inMat)
    }

    shape3js.userData["ocShape"] = shape

    const clonedShape = new openCascade.BRepBuilderAPI_Copy_2(shape,true,true);
    const result = clonedShape.Shape();
    shape3js.userData["ocShapeCloned"] = result

    shape3js.userData["facesColor"] = facesColor
    shape3js.sequenceName = inSequenceName
    shape3js.commonColor = hexColor
    return shape3js
}

export function triggerStepFileChangeEvent() {
    let event = new Event('stepFile-change');
    document.dispatchEvent(event);
}

export function removeObjWithChildren(obj) {
    if (!obj) return
    if (obj.children.length > 0) {
        for (var x = obj.children.length - 1; x >= 0; x--) {
            removeObjWithChildren(obj.children[x])
        }
    }
    if (obj.isMesh) {
        obj.geometry.dispose();
        obj.material.dispose();
    }
    if (obj.parent) {
        obj.parent.remove(obj)
    }
}
export function removeObjWithChildrenWithMoveObjects(obj,pickingObjectsForMove) {
    pickingObjectsForMove.splice(pickingObjectsForMove.indexOf(obj), 1)

    if (!obj) return
    if (obj.children.length > 0) {
        for (var x = obj.children.length - 1; x >= 0; x--) {
            removeObjWithChildren(obj.children[x])
        }
    }
    if (obj.isMesh) {
        obj.geometry.dispose();
        obj.material.dispose();
    }
    if (obj.parent) {
        obj.parent.remove(obj)
    }
}

export function moveObjectToCenter(inObject, YBottomBool = false) {
    //DESCRIPTION : it will take model and if object position is not center then it will make object in center 

    // Create object parent
    let parent = new THREE.Object3D()
    parent.add(inObject)

    // Getting bounding box from scene object
    let box = new THREE.Box3()
    box.setFromObject(inObject)

    // Getting bounding box center
    let center = new THREE.Vector3()
    box.getCenter(center)

    // Reverse center to get translation vector for object to move center
    center.negate()

    inObject.position.copy(center)

    if (YBottomBool) {
        // Getting bounding box from parent object
        let box2 = new THREE.Box3()
        box2.setFromObject(parent)

        let minY = box2.min.y
        let translateY = minY
        inObject.translateY(translateY)
    }
    return parent
}

export function getIntersectingData(intersection) {

    if (intersection.length > 0) {
        // set the position of the cylinder
        let intersectionPoint = intersection[0].point

        // get the vector normal to face
        var normalVectorWithoutRotation = intersectionPoint.face.normal.clone();
        var normalVector = intersectionPoint.face.normal.clone();

        // get rotation in case of object rotation 
        var objRotation = intersectionPoint.object.rotation;

        // Apply mesh rotation to vector
        normalVector.applyEuler(objRotation);

        // the object points up 
        var up = intersectionPoint.object.up;

        // determine an axis to rotate around
        // cross will not work if normalVector == +up or -up, so there is a special case
        if (normalVector.y == 1 || normalVector.y == -1) {
            var axis = new THREE.Vector3(1, 0, 0)
        }
        else {
            var axis = new THREE.Vector3().crossVectors(up, normalVector);
            axis.normalize();
        }

        // determine the amount to rotate
        // var radians = Math.acos( normalVector.dot( up ) );
        var radians = normalVector.angleTo(up)


        // return intersectionPoint
        return { intersectionPoint, axis, radians, normalVector, normalVectorWithoutRotation }
    }
}

export let logMessage = (warnMessage, ...extraMessage) => {
    console.error("DRIVE-CONFIGURATOR :\n" + warnMessage, extraMessage)
}
export let getWorldPointData = (obj) => {
    const position = new THREE.Vector3(); // create one and reuse it
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    obj.matrixWorld.decompose(position, quaternion, scale);
    let gRotation = new THREE.Euler().setFromQuaternion(quaternion, "XYZ")
    return { position, gRotation, scale }
}

export function goToView(inView, scene, camera, controls) {
    // params : frontView topView rightView leftView
    let shape = scene.getObjectByName("shape")
    if (!shape) return

    // Bounding box
    const boundingBox = new THREE.Box3();
    boundingBox.setFromObject(shape);

    // Sphere
    const boundingSphere = new THREE.Sphere()
    boundingBox.getBoundingSphere(boundingSphere)

    // Center
    const center = boundingSphere.center
    const radius = boundingSphere.radius * 1.3

    let position = center.clone();

    //you can make frontView by using this
    switch (inView) {
        case undefined:
            return
        case "frontView":
            position.z += radius;

            break
        case "rearView":
            position.z -= radius;

            break
        case "topView":
            position.y += radius;

            break
        case "bottomView":
            position.y -= radius;

            break
        case "rightView":
            position.x += radius;

            break
        case "leftView":
            position.x -= (radius);
            break
        case "bottomView":
            position.y = -(position.y + radius);
            break
        case "rearView":
            position.z = -(position.z + radius);
            break
        default:
    }
    if (!position) return
    controls.reset()
    camera.position.copy(position)
    controls.target.copy(center)
    controls.update();
    updateSliderZoom(camera)
}

export let generateGeometryBorder = (geometry) => {
    var geo = new THREE.EdgesGeometry(geometry);
    var mat = new THREE.LineBasicMaterial({ color: "black" });
    var wireFrame = new THREE.LineSegments(geo, mat);
    wireFrame.name = "perimeterBorder"
    return wireFrame
}
export function radianToDegree(radians) {
    var pi = Math.PI;
    return radians * (180 / pi);
}
export function degreeToRadian(degrees) {
    // convert angle from degree to radian
    var pi = Math.PI;
    return degrees * (pi/180);
}

export function detachTransformControl(threeViewer, errorMessage) {
    if (threeViewer.transformControl) {
        try {
            threeViewer.transformControl.detach();
            threeViewer.transformControl.reset();
        } catch (error) {
            logMessage(error, errorMessage, threeViewer.transformControl)
        }
    }
}

export function getMidPoint(vectorA, vectorB) {
    // get mid point of two point
    var midpoint = new THREE.Vector3();
    midpoint.copy(vectorA);
    midpoint.add(vectorB).multiplyScalar(0.5);
    return midpoint;
}

export let urlToFile = async (url,name) => {
    // this function will convert url to file type
    try {
        const response = await fetch(url);
        if (response.status === 404){
            return null
        }
        // here file is url/location of file
        const blob = await response.blob();
        const file = new File([blob], name,{type: blob.type});
        return file
    } catch (error) {
        console.error(error, "error from urlToFile")
        return null
    }
}

export let blobToLInk = (blob, filename) => {
    // this function will convert blob to link type
    const link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link); // Firefox workaround, see #6594
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    return link
}

export let blobToFile = (blob, filename) =>{
    // This function will convert blob to file type
    var file = new File([blob], filename);
    return file
}


export let roundDigit = (number, decimalPlace = 3) => {
    /**
     * This function convert number to precision upto given decimal places
     * @param {Number} number - round number
     * @param {Number} inPoints - decimal places
     * @returns {Number} rounded number
     */
    number = parseFloat(number)
    if (!number) return 0
    let digitMultiplier = Math.pow(10, decimalPlace);
    return Math.round((number + Number.EPSILON) * digitMultiplier) / digitMultiplier
}

export function findPointAtDistInDirection(origin, dist, dir) {
    let point = origin.clone()
    point.add(dir.clone().setLength(dist))
    return point
}
Array.prototype.remove = function (inElement) {

    // This function will delete first element which is equal to inElement
    // If inElement is not in array, nothing happened and return false
    let index = this.indexOf(inElement)
    if (index != -1) {
        this.splice(index, 1)
        return true
    }
    return false
}

export function fitCameraAndUpdateSliderZoom(viewer, boundingBox, direction) {
    fitCameraToBoundingBox(viewer, boundingBox, direction)
    updateSliderZoom(viewer.camera)
}
// Move camera to fit bounding box in given direction
export function fitCameraToBoundingBox(viewer, boundingBox, direction) {
    let center = boundingBox.getCenter(new THREE.Vector3())
    let size = boundingBox.getSize(new THREE.Vector3())
    let halfSize = size.length() / 2
    let dist = halfSize / Math.tan((90 * Math.PI) / 360)
    let pos = new THREE.Vector3()
    pos.copy(direction)
    pos.multiplyScalar(dist)
    pos.add(center)
    viewer.orbitControl.reset()
    viewer.camera.zoom = 4.5
    viewer.camera.position.copy(pos)
    viewer.camera.up.set(0, 1, 0);
    viewer.camera.updateProjectionMatrix()
    viewer.orbitControl.target.copy(center)
    viewer.orbitControl.update()
  }
export function updateSliderZoom(camera){
    let zoomSlider = document.getElementById('zoomSlider');
    let cameraZoomValue = camera.zoom
    zoomSlider.value = cameraZoomValue
}

export function createThreeLine(inPoint1, inPoint2) {
    const point1 = inPoint1 // first point
    const point2 = inPoint2 // second point

    // Create a Float32Array with the positions of the two points
    const positions = new Float32Array([
        point1.x, point1.y, point1.z,
        point2.x, point2.y, point2.z
    ]);

    // Create a buffer geometry for the line using the positions array
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Create a material for the line (in this case, a basic solid color material)
    const material = new THREE.LineBasicMaterial({ color: getRandomColor() });

    // Finally, create the line object and add it to the scene
    const line = new THREE.Line(geometry, material);
    return line
}

export function createLine(inPoint) {
    let geometry = new THREE.BufferGeometry().setFromPoints(inPoint)
    let material = new THREE.LineBasicMaterial({
        color: getRandomColor()
    });
    const line = new THREE.Line(geometry, material);
    return line
}
function getRandomColor() {
    const r = (Math.floor(Math.random() * 256)) / 255;
    const g = (Math.floor(Math.random() * 256)) / 255;
    const b = (Math.floor(Math.random() * 256)) / 255;

    return new THREE.Color(r, g, b)
}
export function getAllVertices(obj){
    /**
     * This function return all vertices of object
     * @param {Mesh} obj
     * @returns {Array<THREE.Vector3>} 
     */
    const vertices = []
    let positions = obj.geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
        let vertexPosition = new THREE.Vector3().fromBufferAttribute(positions, i); 
        vertices.push(vertexPosition)
    }
    return vertices

}
export function calculateCircleCenter(point1, point2, radius) {
    // Calculate the distance between the two points
    const distance = Math.sqrt(
      Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
    );
  
    // Calculate the mid-point coordinates between the two points
    const midPointX = (point1.x + point2.x) / 2;
    const midPointY = (point1.y + point2.y) / 2;
  
    // Calculate the direction vector from point1 to point2
    const directionX = (point2.x - point1.x) / distance;
    const directionY = (point2.y - point1.y) / distance;
  
    // Calculate the distance from the mid-point to the center of the circle
    const distanceToCenter = Math.sqrt(Math.pow(radius, 2) - Math.pow(distance / 2, 2));
  
    // Calculate the center coordinates of the circle
    const centerX = midPointX + directionY * distanceToCenter;
    const centerY = midPointY - directionX * distanceToCenter;
  
    // Return the center coordinates as an object
    return { x: centerX, y: centerY };
}

export function distanceBetweenTwoPoints(inP1,inP2){
    /**
     * This function find distance between two points
     * @param {Array of x,y,z Points} inP1
     * @param {Array of x,y,z Points} inP2
     * @returns {Float} 
     */ 
    const dx = inP2.x - inP1.x;
    const dy = inP2.y - inP1.y;
    const dz = inP2.z - inP1.z;

    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    return distance
}


export function checkTwoShapeIntersect(object1,object2){
    /**
     * This function check if two object3d intersect or not
     * @param {THREE.Object3D} object1
     * @param {THREE.Object3D} object2
     * @returns {Boolean} 
    */ 

    // Check for intersection using bounding box intersection test
    let bBox1 = new THREE.Box3().setFromObject(object1);
    let bBox2 = new THREE.Box3().setFromObject(object2);

    const intersection = bBox1.intersectsBox(bBox2);
    // const intersection = mesh1.geometry.boundingBox.intersectsBox(mesh2.geometry.boundingBox);

    if (intersection) { // The shape geometries intersect.
        return true
    } else { // The shape geometries do not intersect.
        return false
    }
}
export function cloneDeep(obj) {
    if (obj === null || typeof (obj) !== 'object' || 'isActiveClone' in obj)
        return obj;

    if (obj instanceof Date)
        var temp = new obj.constructor(); //or new Date(obj);
    else
        var temp = obj.constructor();

    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            obj['isActiveClone'] = null;
            temp[key] = cloneDeep(obj[key]);
            delete obj['isActiveClone'];
        }
    }
    return temp;
}
export function alterShowOriginalShape(show,threeViewer) {
    let shape = threeViewer.scene.getObjectByName("shape")
    let referenceShape = threeViewer.scene.getObjectByName("referenceShape")
    if (shape) threeViewer.scene.getObjectByName("shape").visible = show;
    if (referenceShape) threeViewer.scene.getObjectByName("referenceShape").visible = !show;
  }

export function convertTranslationTo3Vec(inTranslation) {
    return new THREE.Vector3(inTranslation.X(), inTranslation.Y(), inTranslation.Z())
}
export function convert_gp_Mat_THREEJS_Mat4(inGpMat) {
    let mat4 = new THREE.Matrix4();
    mat4.set(
        inGpMat.Value(1, 1), inGpMat.Value(1, 2), inGpMat.Value(1, 3), inGpMat.Value(1, 4),
        inGpMat.Value(2, 1), inGpMat.Value(2, 2), inGpMat.Value(2, 3), inGpMat.Value(2, 4),
        inGpMat.Value(3, 1), inGpMat.Value(3, 2), inGpMat.Value(3, 3), inGpMat.Value(3, 4),
        inGpMat.Value(4, 1), inGpMat.Value(4, 2), inGpMat.Value(4, 3), inGpMat.Value(4, 4)
    )
    return mat4
}
export function getShapeCenterPoint(obj) {
    /**
     * This function return center point of object
     * @param {obj} obj
     * @returns {THREE.Vector3} 
     */
    const boundingBox = new THREE.Box3();
    boundingBox.setFromObject(obj);

    // Calculate the center point of the bounding box
    const centerPoint = new THREE.Vector3();
    boundingBox.getCenter(centerPoint);

    return centerPoint;
}
//Prototype to remove object from array, removes first
//matching object only
// Array.prototype.remove = function (v) {
//     if (this.indexOf(v) != -1) {
//         this.splice(this.indexOf(v), 1);
//         return true;
//     }
//     return false;
// }
export function getBoundingBox(obj) {
    /**
     * This function return center point of object
     * @param {obj} obj
     * @returns {THREE.Vector3} 
     */
    const boundingBox = new THREE.Box3();
    boundingBox.setFromObject(obj);

    return boundingBox;
}
export function getDimensionOfObject(obj) {
    /**
     * This function return center point of object
     * @param {obj} obj
     * @returns {dimensions} 
     */

    if (!obj) 
    {
        console.warn("object is not defined");
        return
    }

    let boundingBox = getBoundingBox(obj)

    const dimensions = boundingBox.getSize(new THREE.Vector3());

    return dimensions;
}

export function addBoundingBoxToParent(group, parent) {
    // Calculate the bounding box dimensions
    const boundingBox = new THREE.Box3().setFromObject(group);
    const boundingBoxSize = new THREE.Vector3();
    boundingBox.getSize(boundingBoxSize);

    // Create a bounding box geometry
    const boundingBoxGeometry = new THREE.BoxGeometry(boundingBoxSize.x, boundingBoxSize.y, boundingBoxSize.z);

    // Create a wireframe material for the bounding box
    const boundingBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    // Create a mesh for the bounding box
    const boundingBoxMesh = new THREE.Mesh(boundingBoxGeometry, boundingBoxMaterial);

    // Set the position of the bounding box to match the group
    boundingBoxMesh.position.copy(boundingBox.getCenter());

    // Add the bounding box mesh to the scene
    parent.add(boundingBoxMesh);

    // Return the bounding box mesh in case further manipulation is needed
    return boundingBoxMesh;
}