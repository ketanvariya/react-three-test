import { degreeToRadian, detachTransformControl, getMidPoint, logMessage, radianToDegree, removeObjWithChildren, removeObjWithChildrenWithMoveObjects } from "./customUtils"
import * as THREE from "three"
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { detachTransControlAndClearXYZValueInHtml, removeObjWithAllSameName } from "./commonFunction";

class InitThreeViewer {
    constructor(threeViewer) {
        this.threeViewer = threeViewer
    }
}
export class CustomSketch extends InitThreeViewer {
    //sketch tool functionalities
    constructor(threeViewer) {
        super(threeViewer)
    }

    cutObject = (obj, pickingObjectsForMove, resetSketchMode) => {
        if (obj && this.threeViewer.transformControl.object) {
            removeObjWithChildrenWithMoveObjects(obj,pickingObjectsForMove)
            obj = null
            detachTransControlAndClearXYZValueInHtml(this.threeViewer, "error while cut object");
            resetSketchMode()
            let dimension = new Dimension(this.threeViewer)
            dimension.updateDimensions()
        }
    }

    removeDimension = (e) => {
        let dimension = new Dimension(this.threeViewer)
        dimension.clearDimension()
        this.threeViewer.scene.dimension.length = 0
    }

    removeMeasuredLines = ()=>{
        this.removeDimension()
        let deleteObjs = []
        deleteObjs.push(this.threeViewer.scene.getObjectsByProperty("name","refMeasureLine"))
        deleteObjs.push(this.threeViewer.scene.getObjectsByProperty("name","measureLine"))
        deleteObjs = deleteObjs.flat()
        deleteObjs.forEach((obj)=>{
            removeObjWithChildren(obj)
        })
    }
}

export class Dimension extends InitThreeViewer {
    // create, update and remove dimensions
    constructor(threeViewer) {
        super(threeViewer)
    }

    createDimension(inPo1, inPo2) {
        let material = new THREE.LineBasicMaterial({
            color: "black"
        });
        let mainObj = new THREE.Object3D()
        mainObj.name = "dimension"
        this.threeViewer.sketcher.getCurrentFace().getObjectByName("dimensionObject").add(mainObj)
        mainObj.add(this.addEndPointInDimension(inPo1.clone()))
        mainObj.add(this.addEndPointInDimension(inPo2.clone()))

        let points = [];
        points.push(inPo1);
        points.push(inPo2);

        let geometry = new THREE.BufferGeometry().setFromPoints(points);

        let obj = new THREE.Line(geometry, material);
        obj.name = "updatedLine"
        obj.renderOrder = 1;

        // Create label
        var distance = inPo1.distanceTo(inPo2);
        var midpoint = getMidPoint(inPo1, inPo2);

        // Create label, set distance and position
        const labelDiv = document.createElement('div');
        labelDiv.className = 'label';
        distance = Math.round((distance + Number.EPSILON) * 100) / 100
        labelDiv.textContent = distance + "MM";

        let distLabel = new CSS2DObject(labelDiv);
        distLabel.name = "measureLabel"

        distLabel.position.copy(midpoint);

        // displayVertices()
        obj.add(distLabel);
        obj.layers.set(0);

        mainObj.add(obj)
        return obj
    }

    updateDimensions() {
        this.clearDimension()
        setTimeout(() => {
            let count = 0
            let arrayForDelete = []
            this.threeViewer.scene.dimension.forEach((dimensionData) => {
                if (dimensionData.point1Circle.parent && dimensionData.point2Circle.parent) {
                    let circle1Pos = dimensionData.point1Circle.getWorldPosition(new THREE.Vector3())
                    let circle2Pos = dimensionData.point2Circle.getWorldPosition(new THREE.Vector3())
                    this.createDimension(circle1Pos, circle2Pos)
                } else {
                    arrayForDelete.push(count)
                }
                count += 1
            })
            arrayForDelete.forEach((c) => {
                this.threeViewer.scene.dimension.splice(
                    c, 1
                );
            })
        }, 500);
    }

    clearDimension() {
        let currentFace = this.threeViewer.sketcher.getCurrentFace()
        if (!currentFace) return
        // If dimension object is created in current face then get it else return the function.
        let dimensionObj = currentFace.getObjectByName("dimensionObject")
        if (!dimensionObj) return

        // Delete the children of dimension object
        let dimensionObjectChildren = dimensionObj.children
        for (let index = dimensionObjectChildren.length - 1; index >= 0; index--) {
            let object = dimensionObjectChildren[index]
            removeObjWithChildren(object)
        }
    }

    addEndPointInDimension(inPo) {
        const geometry = new THREE.CylinderGeometry(2, 2, 0.001, 37, 1);
        const material = new THREE.MeshBasicMaterial({
            color: "red", side: THREE.FrontSide, transparent: true, opacity: 0.5, polygonOffset: true,
            polygonOffsetFactor: -0.2,
            polygonOffsetUnits: -100,
            depthWrite: false
        });
        const cube = new THREE.Mesh(geometry, material);
        cube.name = "customCirc"
        cube.position.copy(inPo)
        cube.renderOrder = 1;
        cube.rotateX(Math.PI / 2)

        return cube
    }
}
function rotateVectorWithNormal(toRotate, normal) {

    const newVector = new THREE.Vector3().copy(toRotate);

    // set up direction
    let up = new THREE.Vector3(0, 1, 0);
    let axis;
    // we want the vector to point in the direction of the face normal
    // determine an axis to rotate around
    // cross will not work if vec == +up or -up, so there is a special case
    if (normal.y == 1 || normal.y == -1) {
        axis = new Vector3(1, 0, 0);
    } else {
        axis = new Vector3().cross(up, normal);
    }

    // determine the amount to rotate
    let radians = Math.acos(normal.dot(up));
    const quat = new THREE.Quaternion().setFromAxisAngle(axis, radians);
    newVector.applyQuaternion(quat);

    return newVector;

}
export class Pattern extends InitThreeViewer {
    constructor(threeViewer) {
        super(threeViewer)
    }
    createLinearPattern(parent, inMesh, inAngle, inDistance, inNoOfIteration, direction, extrudeDataShape, normal) {
        inMesh.userData.draggable = false
        let dir
        if (direction === "y")
            dir = new THREE.Vector3(0, 1, 0); // direction to y axes
        else
            dir = new THREE.Vector3(1, 0, 0); // direction to x axes
        let normDir = new THREE.Vector3(0, 0, 1); // by default z axes
        dir.applyAxisAngle(normDir, inAngle) // rotate it in angle with respect to normal
        for (let i = 1; i < inNoOfIteration; i++) {
            let currentPos = inMesh.position.clone()
            let point = dir.clone()
            point.setLength(inDistance * i)
            currentPos.add(point)
            let newMesh = inMesh.clone()
            newMesh.position.copy(currentPos)

            // push object data in extrudeData for cut
            if (extrudeDataShape && normal) {
                extrudeDataShape.push({
                    id: newMesh.id,
                    normal: normal.clone()
                })
            }
            parent.add(newMesh)
        }
    }

    createRectangularPattern(parent, inMesh, inAngle, inDistanceX, inDistanceY, inNoOfIterationX, inNoOfIterationY, extrudeDataShape, normal) {
        let linearParentObj = new THREE.Object3D()
        linearParentObj.attach(inMesh)
        this.createLinearPattern(linearParentObj, inMesh, inAngle, inDistanceX, inNoOfIterationX, "x")
        this.createLinearPattern(parent, linearParentObj, inAngle, inDistanceY, inNoOfIterationY, "y")
        parent.add(linearParentObj)
        pushInExtrudeDataShape()

        function pushInExtrudeDataShape() {
        // push object data in extrudeData for cut
            const entities = ["circleGeo", "rectGeo", "ellipseGeo", "shapeParentGeo"];
            parent.traverse((child) => {
                if (entities.includes(child.name)) {
                    extrudeDataShape.push({
                        id: child.id,
                        normal: normal.clone()
                    })
                }
            })
        }   
    }

    createCircularPattern(parent, inMesh, radius, firstRingQuantity, noOfRings, extrudeDataShape, normal) {
        for (let iR = 1; iR < noOfRings + 1; iR++) {
            let totalObjs = firstRingQuantity * iR
            let equalAngle = degreeToRadian(360 / totalObjs)
            for (let i = 0; i < totalObjs; i++) {
                this.createLinearPattern(parent, inMesh, equalAngle * i, radius * iR, 2, "x", extrudeDataShape, normal)
            }
        }
    }
}
export let makeLine = (startPoint, endPoint, makeBorder = false) => {
    removeObjWithChildren(scene.getObjectByName("refMeasureLine"))

    let objectName
    if (makeBorder) {
        objectName = "border"
    } else {
        objectName = "refMeasureLine"
    }
    const material = new THREE.MeshBasicMaterial({
        color: "black",
        side: THREE.DoubleSide,
        transparent: true, opacity: 0.5,
        polygonOffset: true,
        polygonOffsetFactor: -0.2,
        polygonOffsetUnits: -100,
        depthWrite: false
    });
    let points = [];
    points.push(startPoint);
    points.push(endPoint);
    let geometry = new THREE.BufferGeometry().setFromPoints(points);
    let obj = new THREE.Line(geometry, material);
    obj.name = objectName
    obj.renderOrder = 2;
    return obj
}
export function measureDistance(vectorA, vectorB, inParent = scene) {
    let line = makeLine(vectorA, vectorB)
    inParent.add(line)
    var distance = vectorA.distanceTo(vectorB);
    var midpoint = getMidPoint(vectorA, vectorB);

    // Create label, set distance and position
    const labelDiv = document.createElement('div');
    labelDiv.className = 'label';
    distance = Math.round((distance + Number.EPSILON) * 100) / 100
    labelDiv.textContent = distance + "MM";
    let distLabel = new CSS2DObject(labelDiv);
    distLabel.name = "measureLabel"
    let displayVertices = () => {
        const geometrys = new THREE.SphereGeometry(3, 32, 16);
        const materials = new THREE.MeshBasicMaterial({ color: "red" });
        const spheres = new THREE.Mesh(geometrys, materials);
        spheres.position.copy(midpoint);
        scene.add(spheres);
    }
    distLabel.position.copy(midpoint);
    line.add(distLabel);
    line.layers.set(0);
    line.getStartPoint = ()=>{
        return vectorA
    }
    return line
}
