import * as THREE from 'three'
import { DCFace } from '../threeCustom/DCFace';
import { createSketchPlane } from '../threeCustom/sketch/DCSketcher';
import { fitCameraAndUpdateSliderZoom, removeObjWithChildren } from './customUtils';
import { getBoundingBox } from './geometryUtils';
import { measureDistance } from './customSketch';
import { environmentVariable } from '../variables';
import { attachTransformControl } from './commonFunction';
import { swapAllGraphicsToPreviousParent } from '../views/imgUpload';
export function checkIsCursorOnStartPoint(intersects) {
    let isTrue = false
    intersects.forEach(function loop(mesh) {
        if (loop.stop) { return }
        if (mesh.object.name === "customCirc") {
            isTrue = true;
            loop.stop = true;
        }
    });
    return isTrue
}
function lastHoverFace(){
    let lastHoverFace
    return {
        setFace(face){
            face.material.previousColor = face.material.color.clone()
            lastHoverFace = face
        },
        getFace(){
            return lastHoverFace
        }
    }

}
let lastFaceSetter = lastHoverFace()
export function updateFaceColorOnHover(inHoveredFace ) {
    let previousFace = lastFaceSetter.getFace()
    if (previousFace) previousFace.material.color = new THREE.Color(previousFace.material.previousColor)
    lastFaceSetter.setFace(inHoveredFace)
    inHoveredFace.material.color.setHex(0x00ff00)

}

export function updateFaceColorOnClick(inObject, inClickedFace) {
    if (!inObject) return

    // inObject.children.forEach((e) => {
    //     if (e.material)
    //         e.material.color = new THREE.Color(0x5b95d4)
    // })

    inClickedFace.material.color.set("gray"); // use this color for light issue

}

export function handleHoverFaceSelection(in3Viewer) {
    /**
     * This function will handle face selection on hover
     * It will update color of the face on hover
     */
    // Create raycaster and set layers to 1 ( Model Layer )
    var raycaster = new THREE.Raycaster();
    raycaster.layers.disableAll()
    // raycaster.layers.enable(1)
    raycaster.layers.enable(6)
    raycaster.setFromCamera(in3Viewer.mouse, in3Viewer.camera);
    // raycaster.layers.enableAll()

    var intersects = raycaster.intersectObjects(in3Viewer.scene.children, true);
    // Check intersection, if not return
    if (intersects.length == 0) return
    
    // Update color on hover
    let hoveredFace = intersects[0].object
    // If hovered face is not a DCFace, return
    if (!hoveredFace instanceof DCFace) {
        return
    }
    updateFaceColorOnHover(hoveredFace )
    return
}

export function checkIntersectionHoverOnScene() {
    let intersects = intersectToScene(threeViewer)
    let point

    point = intersects[0].point.clone()
    // if (mesh) point = mesh.position.clone()

    switch (threeViewer.sketcher.entityMode) {
        case "globalMeasure":
            scaleCircleIfIntersectedToReferenceCircle(threeViewer)
            handleLineOnHover(threeViewer, undefined, point,scene);
            break;

        default:
            break;
    }
}

export function handleHoverWhileSketching(in3Viewer) {
    /**
     * This function will handle selection while sketching
     */
    let raycaster = new THREE.Raycaster();
    raycaster.layers.disableAll()
    raycaster.layers.enable(2) // Sketch Layer
    raycaster.layers.enable(3) // Entity Layer
    raycaster.setFromCamera(in3Viewer.mouse, in3Viewer.camera);

    var intersects = raycaster.intersectObjects(in3Viewer.scene.children, true);

    // Check intersection, if not return
    if (intersects.length == 0) return

    let point = intersects[0].point
    let mesh = intersects[0].object

    // Handle if paste mode is on
    if (in3Viewer.sketcher.mode == "paste") {
        let localPoint = mesh.worldToLocal(point.clone())
        in3Viewer.clipboardActions.changePosition(localPoint)
    }
    switch (in3Viewer.sketcher.entityMode){

        case "rectangle":
        case "circle":
        case "ellipse":
            if (mesh && mesh.name == "sketchPlane") {
                let localPoint = mesh.worldToLocal(point.clone())
                if (in3Viewer.sketcher.currentEntity) {
                    in3Viewer.sketcher.currentEntity.updatePoint(localPoint, in3Viewer.sketcher.currentEntity.points.length - 1)
                }
            }
            break;

        case "line":
            if (mesh && mesh.name == "sketchPlane") {
                if (in3Viewer.sketcher.currentEntity) {
                    let localPoint = mesh.worldToLocal(point.clone())
                    let currEntity = in3Viewer.sketcher.currentEntity
                    let startPoint = currEntity.getStartPoint()
                    startPoint.scale.set(1, 1, 1)
                    if (currEntity.points.length > 2) {
                        if (localPoint.distanceTo(startPoint.position) < 1) {
                            startPoint.scale.set(2, 2, 2)
                        }
                    }
                    in3Viewer.sketcher.currentEntity.updatePoint(localPoint, in3Viewer.sketcher.currentEntity.points.length - 1)
                }
            }
            break;

        case "measure":

            scaleCircleIfIntersectedToReferenceCircle(in3Viewer)
            handleLineOnHover(in3Viewer, mesh, point,in3Viewer.sketcher.getCurrentFace());
            break;

        default:
            break;
    }
}
function handleLineOnHover(in3Viewer, mesh, point, parent) {
    if (in3Viewer.sketcher.currentEntity) {
        let localPoint
        if (mesh) 
            localPoint= mesh.worldToLocal(point.clone());
        else {
            localPoint = point
        }
        let currEntity = in3Viewer.sketcher.currentEntity;
        let startPoint = currEntity.getStartPoint();
        if (startPoint) {
            const distance = localPoint.distanceTo(startPoint);
            if (distance) {
                measureDistance(startPoint, point.clone(), parent.getObjectByName("dimensionObject"));
            }
        }
    }
}

function handleLineOnHover2(in3Viewer, mesh, localPoint,parent) {
    if (in3Viewer.sketcher.currentEntity) {
        // if (mesh){
            localPoint = mesh.worldToLocal(localPoint.clone());
        // }
        let currEntity = in3Viewer.sketcher.currentEntity;
        let startPoint = currEntity.getStartPoint();
        if (startPoint) {
            const distance = localPoint.distanceTo(startPoint);
            if (distance) {
                measureDistance(startPoint, localPoint.clone(), parent.getObjectByName("dimensionObject"));
            }
        }
    }
}

function centerPoint(){
    const centerPointGeometry = new THREE.SphereGeometry(1, 32, 32);
    centerPointGeometry.name = "faceCenterSphere"
    const centerPointMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const centerPoint = new THREE.Mesh(centerPointGeometry, centerPointMaterial);
    return centerPoint
}
let centerSphere = centerPoint()
export function handleClickFaceSelection(in3Viewer) {
    /**
     * This function will handle face selection on click
     * It will update color of the face on click
     */

    // Create raycaster and set layers to 1 ( Model Layer )
    var raycaster = new THREE.Raycaster();
    raycaster.layers.disableAll()
    raycaster.layers.enable(1) // Model Layer
    raycaster.setFromCamera(in3Viewer.mouse, in3Viewer.camera);

    let intersects = raycaster.intersectObjects(in3Viewer.scene.children, true);

    // Check intersection, if not return
    if (intersects.length == 0) return

    // Check if intersected object is a DCFace, if not return
    if (!intersects.object instanceof DCFace) return
    let filteredIntersection = getFirstVisibleObj(intersects);
    if (!filteredIntersection) return
    let intersectedData = filteredIntersection.intersect
    // pickingObjects.remove(scene.getObjectByName("sketchPlane"))
    removeObjWithChildren(in3Viewer.scene.getObjectByName("sketchPlane"))

    let planeMesh = createSketchPlane()

    intersectedData.object.threeFace.add(planeMesh)

    in3Viewer.sketcher.setCurrentFace(intersectedData.object)

    updateFaceColorOnClick(in3Viewer.scene.getObjectByName("shape"), intersectedData.object)
    
    in3Viewer.orbitControl.enableRotate = false
    let bbox = getBoundingBox(intersectedData.object.geometry)

    bbox.applyMatrix4(intersectedData.object.matrixWorld)

    let normalFrom1stFace = getFirstFacePointsIndex(intersectedData.object,in3Viewer)

    let normal = intersectedData.face.normal.clone().applyMatrix4(intersectedData.object.matrixWorld).normalize()
    fitCameraAndUpdateSliderZoom(in3Viewer, bbox, normalFrom1stFace)
    // fitCameraToBoundingBox(in3Viewer, bbox, normalFrom1stFace)


    intersectedData.object.threeFace.attach(centerSphere)
    centerSphere.position.set(0,0,0)
    let referenceShape = in3Viewer.scene.getObjectByName("referenceShape")
    if (referenceShape){
        let DCShapes = referenceShape.getObjectsByProperty("customType","DCShape")
        DCShapes.forEach((obj)=>{
            obj.visiblePrevious = obj.visible
            if (obj.id != in3Viewer.sketcher.currentFace.parent.id && obj.parent.name !== "libraryShape")
                obj.visible=false;
            else obj.visible = true
        })
    }
    swapAllGraphicsToPreviousParent(in3Viewer)
    document.getElementById("rightHeader").classList.remove("displayNone")
    document.getElementById("rightHeaderHome").classList.add("displayNone")
    return true

}
export function selectAndAttachTransformControl(in3Viewer) {
    in3Viewer.transformControl.enabled = true
    var raycaster = new THREE.Raycaster();
    raycaster.layers.disableAll()
    raycaster.layers.enable(3) // Entity Layer
    raycaster.setFromCamera(in3Viewer.mouse, in3Viewer.camera);
    let intersect = raycaster.intersectObjects(in3Viewer.scene.children, true);
    let sketcher = in3Viewer.sketcher

    // Check intersection, if not return
    if (intersect.length > 0){
        let intersectedData = intersect[0].object
    
        if (intersectedData.name == "threeEntity") {
    
            // If Entity is part of a group, attach transform control to group
            if (["DCPattern","cutOutLibrary","font"].includes(intersectedData.parent.parent.name)) {
                attachTransformControl(in3Viewer,intersectedData.parent.parent)
                sketcher.setSelectedEntity(intersectedData.parent.parent)
            }
            else {
                attachTransformControl(in3Viewer,intersectedData.parent)
                sketcher.setSelectedEntity(intersectedData.parent)
            }
        }

        if(intersectedData.parent.parent.shapeName === "libraryShape" || (intersectedData.name === "imageMesh" && intersectedData.isGraphicImg) ){
            attachTransformControl(in3Viewer,intersectedData.parent)
        }else if (intersectedData.name === "imageMesh" && !intersectedData.isGraphicImg){
            attachTransformControl(in3Viewer,intersectedData.parent.parent.parent)
        }
    }
    // if (in3Viewer.DCShapesPickingObjects){

    //     var raycaster2 = new THREE.Raycaster();
    //     raycaster2.setFromCamera(in3Viewer.mouse, in3Viewer.camera);
    //     raycaster2.layers.disableAll()
    //     raycaster2.layers.enableAll() // Entity Layer
    //     let intersect2 = raycaster2.intersectObjects(in3Viewer.scene.children, true);
    //     intersect2.forEach((e)=>{
    //             // Check intersection, if not return
    //             let intersectedData2 = e.object
    //             if (intersectedData2.name == "libraryShape") {
    //                 attachTransformControl(in3Viewer,intersectedData2)
    //                 sketcher.setSelectedEntity(intersectedData2)
    //             }
            
    //     })
    // }

    

}
export function checkIfObjIntersect(in3Viewer) {
    /** 
    This function check that layer 1,2 or 3 intersect with object or not 
    * @param {ThreeViewer} in3Viewer
    * @return {object <isIntersect {Boolean} intersectedData {THREE.Object3D}>} 
    */
    var raycaster = new THREE.Raycaster();
    raycaster.layers.disableAll()
    raycaster.layers.enable(1) // Entity Layer
    raycaster.layers.enable(2) // Entity Layer
    raycaster.layers.enable(3) // Entity Layer
    raycaster.setFromCamera(in3Viewer.mouse, in3Viewer.camera);
    let intersect = raycaster.intersectObjects(in3Viewer.scene.children, true);
    let sketcher = in3Viewer.sketcher

    // Check intersection, if not return
    let data = {
        isIntersect : false
    }
    if (intersect.length == 0){
        return data
    }

    let intersectedData = intersect[0]
    data.isIntersect= true
    data["intersectedData"] = intersectedData
    return data
}

export function intersectToReferencePoint (in3Viewer){

    /**
     * This function intersect between reference points
     * @returns {intersects}
     */
    let raycaster = new THREE.Raycaster();
    raycaster.layers.disableAll()
    raycaster.layers.enable(4) // Sketch Layer
    raycaster.setFromCamera(in3Viewer.mouse, in3Viewer.camera);
    let intersects = raycaster.intersectObjects(in3Viewer.scene.children, true);

    // Check intersection, if not return
    if (intersects.length == 0) return
    return intersects
}
export function intersectToScene (in3Viewer){

    /**
     * This function intersect between reference points
     * @returns {intersects}
     */
    let raycaster = new THREE.Raycaster();
    raycaster.layers.disableAll()
    raycaster.layers.enableAll() // Sketch Layer
    raycaster.setFromCamera(in3Viewer.mouse, in3Viewer.camera);
    let intersects = raycaster.intersectObjects(in3Viewer.scene.children, true);

    // Check intersection, if not return
    if (intersects.length == 0) return
    return intersects
}

export function scaleCircleIfIntersectedToReferenceCircle (in3Viewer) {
    let intersects = intersectToReferencePoint(in3Viewer)

    // restHoveredMesh
    if (in3Viewer.sketcher.currentHoveredReferenceMesh) {
        in3Viewer.sketcher.currentHoveredReferenceMesh.scale.set(1,1,1)
        in3Viewer.sketcher.currentHoveredReferenceMesh = null
    }

    // Check intersection, if not return
    if (!intersects) return

    // scale circle
    const mesh = intersects[0].object;
    if (mesh.name === "perimeterBorder") return
    mesh.scale.set(2, 2, 2)
    in3Viewer.sketcher.currentHoveredReferenceMesh = mesh
}

export function selectAndRemoveLine(in3Viewer) {
    var raycaster = new THREE.Raycaster();
    raycaster.layers.disableAll()
    raycaster.layers.enable(5) // Trim Layer
    raycaster.setFromCamera(in3Viewer.mouse, in3Viewer.camera);
    let intersect = raycaster.intersectObjects(in3Viewer.scene.children, true);

    // Check intersection, if not then return
    if (intersect.length == 0) return

    let intersectedData = intersect[0].object
    intersectedData.visible = false
    intersectedData.name = "trimLineNeglect"

    // Get open-cascade data
    let ocData
    let parent = intersectedData.parent
    let needWhile = true
    while (needWhile) {
        if (parent.name == "trimShape") {
            needWhile = false
            ocData = parent.ocData
        }else{
            parent = parent.parent
        }
    }

    let needBreakLoop = false
    // Search and remove line from ocData
    for (let i = 0; i < ocData.length; i++) {
        const entity2DDriveArray = ocData[i];
        for (let k = 0; k < entity2DDriveArray.length; k++) {
            const entity2DDrive = entity2DDriveArray[k];
            let mesh = entity2DDrive.mesh

            for (let j = 0; j < mesh.length; j++) {
                let line = mesh[j];
                if (line.id == intersectedData.id) {
                    mesh.splice(j, 1)
                    entity2DDrive.trimmedCurve.splice(j,1)
                    needBreakLoop = true // line is searched now break the loop
                    break;
                }
            }

            // Break  loop
            if (needBreakLoop) break;
            
        }

        // Break  loop
        if (needBreakLoop) break;

    }

    removeObjWithChildren(intersectedData)

}

function getFirstFacePointsIndex(inObject, in3DViewer) {
    let geometry = inObject.geometry
    let index = geometry.index.array
    let position = geometry.attributes.position.array

    let po1Index = index[0]
    let po2Index = index[1]
    let po3Index = index[2]

    let po1 = new THREE.Vector3(position[po1Index * 3], position[po1Index * 3 + 1], position[po1Index * 3 + 2])
    let po2 = new THREE.Vector3(position[po2Index * 3], position[po2Index * 3 + 1], position[po2Index * 3 + 2])
    let po3 = new THREE.Vector3(position[po3Index * 3], position[po3Index * 3 + 1], position[po3Index * 3 + 2])

    let worldMatrix = inObject.matrixWorld

    po1.applyMatrix4(worldMatrix)
    po2.applyMatrix4(worldMatrix)
    po3.applyMatrix4(worldMatrix)

    // Get normal from 3 points
    let normal = new THREE.Vector3()
    let v1 = new THREE.Vector3()
    let v2 = new THREE.Vector3()

    v1.subVectors(po2, po1)
    v2.subVectors(po3, po1)
    normal.crossVectors(v1, v2)
    normal.normalize()

    return normal
}

function getFirstVisibleObj(intersections){

    let intersect = filterIntersections(intersections)

    return intersect

    function isObjectVisible(object) {
        // Check if the object is directly visible
        if (!object.visible) {
          return false;
        }
      
        // Check if any of the object's ancestors have visibility set to false
        let parent = object.parent;
        while (parent) {
            if (parent.name === "referenceShape") {
                if (parent.isCutShapeVisible) return true
                else return false
            }
            if (!parent.visible) {
                return false;
            }
            parent = parent.parent;
        }
      
        // All ancestors are visible, so the object is considered visible
        return true;
      }

    // Custom intersection filtering function
    function filterIntersections(intersections) {
        for (let i = 0; i < intersections.length; i++) {
            let intersect = intersections[i]
            let obj = intersect.object
            let isVisible = isObjectVisible(obj)
            if (isVisible) return {intersect}
        }
    }
}