import * as THREE from 'three'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { detachTransformControl, getDimensionOfObject, logMessage, removeObjWithChildren, roundDigit } from "./customUtils";
import { DCShape } from '../threeCustom/DCShape';
import exportStep, { exportIges, findSurfaceAreaFromShape, findVolumeFromShape } from '../openCascadeShapes';
import { applyMatrix4TShape } from '../library';
import { openHtmlModal, readBlob } from './utils';
import { exportStepDoc } from './ocUtils';
import { Dimension } from './customSketch';
import { getDrawnEntitiesJson } from '../views/createDrawnEntitesUsingJson';
import axios from 'axios';
import { environmentVariable } from '../variables';


export let removeDrawingObjects = (scene) => {
    removeObjWithChildren(scene.getObjectByName("refPlane"));
    removeObjWithChildren(scene.getObjectByName("refPlaneOpen"));

    removeObjWithChildren(scene.getObjectByName("circleGeoOpen"));
    removeObjWithChildren(scene.getObjectByName("circleGeo"));

    
    let needLoop = true
    while (needLoop) {
        if (scene.getObjectByName("circleGeo")) {
            removeObjWithChildren(scene.getObjectByName("circleGeo"));
            removeObjWithChildren(scene.getObjectByName("circleGeoOpen"));
        } else {
            needLoop = false
        }
    }
    function deleteEntities(){
        let eles = scene.getObjectsByProperty("customType", "DCEntity")
        eles.forEach(element => {
            removeObjWithChildren(element)
        });
    }
    
    deleteEntities()
    removeLibraryStepShape()

    removeObjWithAllSameName(scene, "DCEntity");
    removeObjWithAllSameName(scene, "image");
    removeObjWithAllSameName(scene, "font");
    removeObjWithAllSameName(scene, "rectGeo");
    removeObjWithAllSameName(scene, "ellipseGeo");
    removeObjWithAllSameName(scene, "lineGeo")
    removeObjWithAllSameName(scene, "measureLabel")
    removeObjWithAllSameName(scene, "measureGeo")
    removeObjWithAllSameName(scene, "customCirc")
    removeObjWithAllSameName(scene, "refShapeParent")
    removeObjWithAllSameName(scene, "shapeParentGeo")
    removeObjWithAllSameName(scene, "dimension")
    removeObjWithAllSameName(scene, "measureLine")
    removeObjWithAllSameName(scene, "trimShape")

    function removeLibraryStepShape(){
        let libraryStepShapes = scene.getObjectsByProperty("shapeName","libraryShape");
        libraryStepShapes.forEach((obj)=>{
            removeObjWithChildren(obj)
        })
    }
}

export function removeObjWithAllSameName(scene, name) {
    let needLoop = true;
    while (needLoop) {
        let obj = scene.getObjectByName(name)
        if (obj) removeObjWithChildren(obj)
        else needLoop = false;
    }
}

// Get distance and midpoint
export class progressBar {
    constructor() {
        this.progressBarEle = document.getElementById("progressBar")
        this.progressBarEle.style = `width:0%;display:block`;
    }
    sleep(inMs) {
        return new Promise(resolve => setTimeout(resolve, inMs));
    }
    async setProgress(percent) {
        let roundP = roundDigit(percent,0)
        if (roundP) percent = roundP
        this.progressBarEle.style = `width: ${percent}%`;
        this.progressBarEle.innerHTML = percent + "%";
        await this.sleep(0)
    }
    async resetProgress() {
        this.progressBarEle.style = `width:0%;display: none;`;
        this.progressBarEle.innerHTML = 0 + "%";
        await this.sleep(0)
    }
}

export let detachTransControlAndClearXYZValueInHtml = (threeViewer, errorMessage) => {
    let originX = document.getElementById("originX")
    let originY = document.getElementById("originY")
    let rectWidth = document.getElementById("rectWidth")
    let rectRotationY = document.getElementById("objRotation")
    originX.value = 0.0000
    originY.value = 0.0000
    rectWidth.value = 0.0000
    rectRotationY.value = 0.0000
    detachTransformControl(threeViewer, errorMessage)
    document.getElementById("propertyBox").style.display = "none"
}
export function replaceSTepData(stepData,newStepData,currentFace){
    if (!stepData || !newStepData) return
    stepData[0].length = 0
    stepData[0] = newStepData
    // currentFace.parent.userData.ocShape = newStepData
    return stepData
}

export function resetSketchMode(inViewer) {
    inViewer.customSketch.removeMeasuredLines()
    inViewer.sketcher.entityMode = null
    detachTransControlAndClearXYZValueInHtml(inViewer,"From resetSketchMode mode")
    
    let geometricEles = document.getElementsByClassName("geometric")
    Array.from(geometricEles).forEach((ele) => {
        ele.classList.remove('selected');
    });
}

export function checkInputTextModalIsOn(){
    /**
     * This function check if any Modal which contain input, is currently active or not
     * @returns {Boolean} 
    */
    let inputModels = ["noteFormModal"]
    let inputEleModalIsOn = false
    inputModels.forEach((modal)=>{
        if (inputEleModalIsOn) return
        let check = document.getElementById(modal).classList.contains('show')
        if(check){
            inputEleModalIsOn = true
            return
        }
    })
    return inputEleModalIsOn
}



export function getCutExtrudeDataOfScene(threeViewer,inParent = threeViewer.sketcher.currentFace.parent) {
    let currentFace = threeViewer.sketcher.currentFace.parent
    let entities = currentFace.getObjectsByProperty("sketchType", "cutout")
    let extrudeData = {
        circles: [],
        rectangles: [],
        customShapes: [],
        ellipse: [],
        shapes : [],
        libraryShapes : [],
    }
    entities.forEach((entity) => {
        let entityData = entity
        let type = entity.entityType
        
        switch (type) {
            case "Circle":
                extrudeData.circles.push(entityData)
                break;
            case "Rect":
                extrudeData.rectangles.push(entityData)
                break;
            case "Ellipse":
                extrudeData.ellipse.push(entityData)
                break;
            case "Polyline":
                extrudeData.customShapes.push(entityData)
                break;
            case "DCPolylineWithArc":
                extrudeData.customShapes.push(entityData)
                break;
            default:
                // console.warn("entity type" +type+ " not found",entity)
                break;
        }  
    })
    
    let shapes = currentFace.getObjectsByProperty("name", "trimShape");
    extrudeData["shapes"] = shapes
    
    let libraryShapes = currentFace.getObjectsByProperty("shapeName", "libraryShape");
    extrudeData["libraryShapes"] = libraryShapes

    return extrudeData
}

export function deleteObj(){
    let obj = threeViewer.transformControl.object
    if (!obj) return
    detachTransControlAndClearXYZValueInHtml(threeViewer, "error while cut object");
    removeObjWithChildren(obj)
    // threeViewer.sketcher.removeEntity(obj)
    resetSketchMode(threeViewer)
    let dimension = new Dimension(threeViewer)
    dimension.updateDimensions()
}

export class AddReferenceCircle{
    constructor(){
        this.generateRefCircle()
    }

    generateRefCircle() {
        this.refCircleGeo = new THREE.CircleGeometry(1, 16);
        this.refCircleMat = new THREE.MeshBasicMaterial({
            color: 0xffff00, side: THREE.FrontSide,
            polygonOffset: true,
            polygonOffsetFactor: 0.1,
            polygonOffsetUnits: -200
        });
        this.refCircle = new THREE.Mesh(this.refCircleGeo, this.refCircleMat);
        this.refCircle.name = "refCircle"
        // this.refCircle.visible = false
    }

    addRefPoint(inPoint) {
        let refCircle = this.refCircle.clone()
        refCircle.position.copy(inPoint)
        refCircle.layers.set(4)
        return refCircle
    }
}

export function attachTransformControl(inViewer,obj){
    if (!obj) return
    
    let transformControl = inViewer.transformControl

    transformControl.showX = true
    transformControl.showY = true
    transformControl.showZ = false
    // transformControl.setMode('translate');
    transformControl.attach(obj)

}

export function getEntityName(entity){
    switch (entity) {
        case "Rect":
            return "Rectangle"
            break;
        case "Circle":
            return "Circle"
            break;
        case "Ellipse":
            return "Ellipse"
            break;
        case "Polyline":
            return "Polyline"
            break;
    
        default:
            return ""
            break;
    }
}

export function getShapeNameFromReferenceShapeName(referenceSHapeName){
    // this function will return shape-name(which is the cut shape) from reference shape(which is the sketching shape) name
    let sequenceCount = referenceSHapeName.split("_")[0]
    let cutShapeName = sequenceCount + "_shape"
    return cutShapeName

}
export function getFaceNameFromReferenceFaceName(referenceFaceName){
    // this function will return face-shape-name(which is the cut shape) from reference face shape(which is the sketching shape) name
    let nameData = referenceFaceName.split("_referenceShape")
    let sequenceCount = nameData[0]
    let cutFaceName = `${sequenceCount}_shape`
    return cutFaceName
}

export function visibleDCShapeAsPreviousVisible() {
    // MAKE VISIBLE ALL SHAPE AS PREVIOUS
    let referenceShape = threeViewer.scene.getObjectByName("referenceShape")
    let DCShapes = referenceShape.getObjectsByProperty("customType", "DCShape")
    DCShapes.forEach((obj) => {
        if (obj.visiblePrevious != undefined && obj.parent.shapeName !== "libraryShape")
            obj.visible = obj.visiblePrevious
    })
}

export function getRandomFiveDigitNumber() {
    const min = 10000; // Smallest 5-digit number (10,000)
    const max = 99999; // Largest 5-digit number (99,999)
  
    // Math.random() returns a number between 0 (inclusive) and 1 (exclusive)
    // To get a number between min and max (inclusive), we use the following formula:
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

 export function calculateMassProperties(shape) {
    if (!shape) return
    let totalVolume = 0
    let totalArea   = 0
    shape.traverse((ocShape) => {
        if (ocShape instanceof DCShape) {
            //Volume
            let volume = findVolumeFromShape(window.openCascade, ocShape.userData.ocShape)
            let area   = findSurfaceAreaFromShape(window.openCascade, ocShape.userData.ocShape)
            ocShape.userData.Volume = volume
            ocShape.userData.Area = area
            totalVolume += volume
            totalArea += area
        }
    })
    let dimensions = getDimensionOfObject(shape)
    return {
        totalVolume,
        totalArea,
        dimensions,
    }
}


export function getShapeStepFileBlob(threeViewer,seqName = undefined,type){
    let openCascade = window.ocGlobal
    let shape
    if (seqName == undefined){
        shape = threeViewer.scene.getObjectByName("shape")
    }else{
        shape = threeViewer.scene.getObjectByProperty("sequenceName",seqName)
    }
    let ocShapesArray = []
    shape.traverse((ocShape) => {
        if (ocShape instanceof DCShape) {
            ocShape.updateMatrixWorld()
            let trsfShape = applyMatrix4TShape(openCascade, ocShape.userData.ocShape, ocShape.matrixWorld)
            ocShapesArray.push(trsfShape)
        }
    })
    // let stepBlob = exportStep(openCascade, ocShapesArray)
    let stepBlob
    if (type === "iges") {
         stepBlob = exportIges(openCascade, ocShapesArray)
    } else {
         stepBlob = exportStepDoc(openCascade, threeViewer.ocTools.doc)
        //  stepBlob = exportStep(openCascade, ocShapesArray)
    }

    return stepBlob
}

export async function getShapeJsonFileBlob(threeViewer)
{    
    
    let referenceShapeObj = threeViewer.scene.getObjectByName("referenceShape")
    if (! referenceShapeObj.fileUrl ){
        let stepFileData = await uploadReferenceShape(threeViewer.file.name,threeViewer.file)
        if (!stepFileData) {
            console.error("something went wrong while uploading step file in the Json export")
            return false
        }
        referenceShapeObj.fileUrl = environmentVariable.REACT_APP_DatabaseServer + `add-to-cart/download-model?model_name=${stepFileData.file_name}`
    }
    let drawnEntities = await getDrawnEntitiesJson(threeViewer);
    let json = {
        fileUrl : referenceShapeObj.fileUrl,
        entities : drawnEntities
    }
    var jsonString = JSON.stringify(json, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    return blob
}

export function countOccurrencesInArray(array, targetValue) {
    return array.reduce((count, currentValue) => {
        if (currentValue === targetValue) {
            return count + 1;
        }
        return count;
    }, 0);
}

export async function uploadReferenceShape(fileName,file) {
    return new Promise((resolve, reject) => {
            const data = new FormData();
            let stlFile = file
            data.append('modelFile', stlFile);
            data.append('assemblyName', fileName);
            axios.post(`${environmentVariable.REACT_APP_DatabaseServer}add-to-cart/upload-step`, data)
                .then((res) => {
                    if (res.data.error) {
                    console.error("While uploading step file using axios went wrong",res.data.error)

                        reject("something went wrong at add-to-cart/upload-step")
                        return false
                    }else{
                        let response = res.data.data
                        if (response)
                        resolve(response)
                    else reject("response is not defined")
                    }
                })
                .catch((error) => {
                    console.error("An error occurred:", error);
                    reject("While uploading step file using axios went wrong")
                    return false
                });

    });

}
export async function uploadGraphicImages(file) {
    return new Promise((resolve, reject) => {
            const data = new FormData();
            let imgFile = file
            data.append('imgFile', imgFile);

            axios.post(`${environmentVariable.REACT_APP_DatabaseServer}add-to-cart/upload-img`, data)
                .then((res) => {
                    if (res.data.error) {
                    console.error("While uploading img file using axios went wrong",res.data.error)

                        reject("something went wrong at add-to-cart/upload-img")
                        return false
                    }else{
                        let response = res.data.data
                        if (response)
                        resolve(response)
                    else reject("response is not defined")
                    }
                })
                .catch((error) => {
                    console.error("An error occurred:", error);
                    reject("While uploading step file using axios went wrong")
                    return false
                });

    });

}

