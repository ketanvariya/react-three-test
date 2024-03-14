import * as THREE from 'three';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { generateDecal, removeObjectWithChildren } from './NL3DUtils';
import { isMobile } from 'react-device-detect';
import createSnapPoints from "./createSnapPoints";

export class DecalHelper extends THREE.Object3D {
    constructor(inObj) {
        super();
        console.log(inObj,"inObj")
        this.decal = inObj;
        this.decal.helper = this;
        this.customType = "decalHelper"
        this.size = {
            x : 5,
            y: 5,
        }
        this.point = inObj.position;
        this.eulerData = inObj.rotation;
        this.cornerZCorrect = 0.0015
        this.threshold = 150
        this.generate()
        this.name = "decalHelper"
        this.visible = true
        this.rotationSnap = THREE.MathUtils.degToRad(5)
        this.addLayerToHelper(4)
    }
    generate() {

        this.position.copy(this.point);
        this.rotation.copy(this.eulerData);
        debugger
        this.update() // get 4 points
        this.addPlane() // add invisible move plane
        this.addCornerCircles()
        this.addLines()
        if (Math.abs(this.rotation.x) > Math.PI / 2) {
            this.decal.userData.rotationAngle = this.rotation.z - Math.PI
        } else {
            this.decal.userData.rotationAngle = this.rotation.z
        }

        this.generateRotationHelper()
    }
    generateRotationHelper() {
        let planeGeo = new THREE.CircleGeometry(0.005);
        let planeMat = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load("./assets/img/icons/rotationHelper.png"),
            transparent: true,
            // show in front of everything else
            depthWrite: false,
            depthTest: false,
        });
        let planeMesh = new THREE.Mesh(planeGeo, planeMat);
        planeMesh.userData.hoveredTexture = new THREE.TextureLoader().load("./assets/img/icons/invertedRotate.png");
        planeMesh.userData.defaultTexture = planeMat.map;
        planeMesh.name = "rotationHelper"
        planeMesh["customType"] = "decalHelper"
        planeMesh["helperType"] = "rotate"
        planeMesh["cursorType"] = "pointer"
        planeMesh.layers.set(3); // 3 is the layer for decal helper

        this.rotationHelper = planeMesh
        this.updateRotationHelperPos()

        // Only add the rotation helper if it is not mobile
        if(!isMobile) { 
            this.add(planeMesh);
        }
    }
    updateRotationHelperPos() {
        this.rotationHelper.position.y = -this.size.y / 2 - 0.01
    }

    update() {
        // Add corner circles
        this.cornerPointsL = [
            new THREE.Vector3(-this.size.x / 2, -this.size.y / 2, 0),
            new THREE.Vector3(this.size.x / 2, -this.size.y / 2, 0),
            new THREE.Vector3(this.size.x / 2, this.size.y / 2, 0),
            new THREE.Vector3(-this.size.x / 2, this.size.y / 2, 0),
        ]
        // Add a small offset to the corner points so that the lines don't intersect with the decal
        let addScalar = 0.002
        this.cornerPointsL[0].add(new THREE.Vector3(-addScalar, -addScalar, 0))
        this.cornerPointsL[1].add(new THREE.Vector3(addScalar, -addScalar, 0))
        this.cornerPointsL[2].add(new THREE.Vector3(addScalar, addScalar, 0))
        this.cornerPointsL[3].add(new THREE.Vector3(-addScalar, addScalar, 0))
        debugger
    }
    addLines() {
        while (this.getObjectByName("refLine")) {
            removeObjectWithChildren(this.getObjectByName("refLine"))
        }
        // Add fat lines
        this.cornerPointsL.forEach((point, index) => {
            debugger
            let nextPoint = this.cornerPointsL[(index + 1) % this.cornerPointsL.length]
            this.addFatLine(point, nextPoint, this)
        })
    }
    addCornerCircles() {
        this.cornerPoints = []
        while (this.getObjectByName("cornerCircle")) {
            removeObjectWithChildren(this.getObjectByName("cornerCircle"))
        }
        this.addCornerCircle(new THREE.Vector3(0, 0, 0), this, 0)
        // this.cornerPointsL.forEach((point,index) => {
        //     // let translatedPoint = point.clone().add(this.point)
        //     // translatedPoint.applyEuler(this.eulerData)
        //     this.cornerPoints.push(this.addCornerCircle(point, this, index))
        // })

    }
    updateCornerCircles() {

        this.cornerPointsL.forEach((point, index) => {
            let pointC = point.clone()
            pointC.z += this.cornerZCorrect
            this.cornerPoints[index].position.copy(pointC)
        })
    }

    addPlane() {
        while (this.getObjectByName("helperPlane")) {
            removeObjectWithChildren(this.getObjectByName("helperPlane"))
        }   
        let plane = new THREE.PlaneGeometry(this.size.x, this.size.y);
        let material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.5,
            depthWrite: false,
            depthTest: false,
            polygonOffset: true,
            polygonOffsetFactor: -4,
        });
        let mesh = new THREE.Mesh(plane, material);
        mesh.visible = false;
        mesh["customType"] = "decalHelper"
        mesh["helperType"] = "translate"
        mesh["cursorType"] = "move"
        mesh.name = "helperPlane"
        mesh.layers.set(3); // 3 is the layer for decal helper
        this.translateHelper = mesh
        this.add(mesh);
    }
    addCornerCircle(inPosition, inPlane, index) {
        // const texture = new THREE.TextureLoader().load('assets/img/icons/circleImage.png');
        let sphereGeometry = new THREE.CircleGeometry(50, 32);
        let sphereMaterial = new THREE.MeshBasicMaterial({ color: "red" });
        let sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
        // sphereMesh.userData.hoveredTexture = new THREE.TextureLoader().load('assets/img/icons/invertedCircleColor.png');
        // sphereMesh.userData.defaultTexture = texture;
        sphereMesh.position.set(inPosition.x, inPosition.y, (inPosition.z + inPlane.cornerZCorrect))
        sphereMesh.layers.set(3); // 3 is the layer for decal helper
        sphereMesh.name = "cornerCircle"
        sphereMesh["customType"] = "decalHelper"
        sphereMesh["helperType"] = "scale"
        sphereMesh["cursorType"] = index % 2 === 0 ? " nesw-resize" : "nwse-resize"
        inPlane.add(sphereMesh)
        return sphereMesh
    }
    addFatLine(inStart, inEnd, inParent) {
        let line = createLineSegment([inStart, inEnd], "black")
        line.name = "refLine"
        // line["customType"] = "decalHelper"
        // line.layers.set(3); // 3 is the layer for decal helper
        inParent.add(line)
    }
    
    updatePosition(inPosition, inEuler, mouseClickPoints) {
        this.decal.elementId = this.id
        
        const newPositionPoints = {
            x: inPosition.x - (mouseClickPoints.x),
            y: inPosition.y - (mouseClickPoints.y),
            z: inPosition.z - (mouseClickPoints.z)
        }
        
        let decal = this.decal
        let section = decal.parent

        // Plot the point on the section plane
        let lPoint = section.getLocal2DPoint(newPositionPoints)
        
        //lPoint.multiplyScalar(1000)
        //lPoint = adjustSnappingVec(lPoint, 2)
        
        const snapPoints = createSnapPoints(section, decal, lPoint)
        
        // Adjust snapping according to need
        //section.snappingObject.update()
        
        //section.snappingObject?.update( lPoint.clone(), decal )
        if (snapPoints.x !== null) {
            lPoint.x = snapPoints.x + snapPoints.xOffset
        }
        if (snapPoints.y !== null) {
            lPoint.y = snapPoints.y + snapPoints.yOffset
        }
        
        //lPoint.multiplyScalar(0.001)

        // Convert to world point
        let wPoint = section.getWorldPoint(lPoint.clone())
        let newPosition = wPoint
        this.position.copy(newPosition)

        let newDecal = generateDecal(decal.material.map, section, newPosition, this.rotation, decal.userData.size, this.id)
        newDecal.layers.set(2) // 2 is the layer for decals stickers
        section.remove(decal)
        section.add(newDecal)
        this.updateDecalData(newDecal)
        

        this.decal = newDecal
        this.decal.snapPoints = snapPoints
        this.decal.helper = this
        this.decal.customType = "sticker"
        this.point = newPosition
        this.decal.material.transparent = true;
        
        // Dispatch event on scene
        this.parent.parent.dispatchEvent({ type: "decalHelperEvent", data: this })
    }
    show() {
        this.visible = true
    }
    hide() {
        this.visible = false
    }
    updateDecalData(newDecal) {
        let decal = this.decal
        newDecal.userData.svg = decal.userData.svg
        newDecal.userData.svgString = decal.userData.svgString
        if (Math.abs(this.rotation.x) > Math.PI / 2) {
            newDecal.userData.rotationAngle = this.rotation.z - Math.PI
        }else{
            newDecal.userData.rotationAngle = this.rotation.z
        }
        newDecal.userData.type = decal.userData.type
        newDecal.userData.needToCheck = decal.userData.needToCheck
        // TODO: fontData for text & effectData for graphic
        newDecal.userData.fontData = decal.userData.fontData
        newDecal.updateEffectData()
        
        newDecal.userData.isInverted = decal.userData.isInverted
        newDecal.userData.imageProcess = decal.userData.imageProcess
        newDecal.userData.effectData = decal.userData.effectData

        if (decal.userData.userSize) {
            newDecal.userData.userSize = decal.userData.size.y
        }
    }
    updateUsingPinch(inScale, inAngle) {

        let decal = this.decal
        let section = decal.parent

        let newSize = decal.userData.size.clone().multiplyScalar(inScale)

        let snapAngle = Math.round(inAngle / this.rotationSnap) * this.rotationSnap

        this.updateRotationUsingAngle(snapAngle, newSize)
        this.size = newSize

        this.update()
        this.addPlane()
        this.addLines()
        debugger
        this.updateCornerCircles()
        this.updateRotationHelperPos()
        this.addLayerToHelper(4) // Temp fix - when we move from scaling to moving the helper, in mobile the helper is not visible on click

    }

    updateSize(inHelperCircle, inPoint) {
        let helperWorldPosition = inHelperCircle.getWorldPosition(new THREE.Vector3())

        let currentDist = this.point.distanceTo(helperWorldPosition)
        let newDist = this.point.distanceTo(inPoint)

        let diff = newDist - currentDist

        let scaleFactor = 1 + diff / currentDist

        let decal = this.decal
        let section = decal.parent

        let newSize = decal.userData.size.clone().multiplyScalar(scaleFactor)
        let newDecal = generateDecal(decal.material.map, section, decal.userData.point, this.rotation, newSize, this.id)
        decal.userData.size = newSize
        this.updateDecalData(newDecal)
        section.remove(decal)
        section.add(newDecal)
        this.decal = newDecal
        this.decal.helper = this
        this.decal.customType = "sticker"

        this.size = newSize

        this.update()
        this.addPlane()
        this.addLines()
        this.updateCornerCircles()
        this.updateRotationHelperPos()
        // newDecal.add(this)
    }
    updateRotation(inPoint) {
        let position = this.position.clone()
        let section = this.parent
        let euler = section.userData.euler
        let matrix = new THREE.Matrix4();
        matrix.makeRotationFromEuler(euler);
        matrix.invert()
        inPoint.applyMatrix4(matrix)
        position.applyMatrix4(matrix)
        let dir = new THREE.Vector3().subVectors(inPoint, position).normalize()

        let angleToXAxis = Math.atan2(dir.y, dir.x)
        // Convert angle to 2pi range
        if (angleToXAxis < 0) {
            angleToXAxis += 2 * Math.PI
        }

        let rotationAngle = angleToXAxis - (Math.PI * 3 / 2)

        if (Math.abs(this.rotation.x) > Math.PI / 2) {
            rotationAngle += Math.PI
        }
        // Snap rotation
        let snapAngle = Math.round(rotationAngle / this.rotationSnap) * this.rotationSnap
        this.updateRotationUsingAngle(snapAngle)
    }

    resetPosition() {
        let decal = this.decal
        let section = decal.parent
        let newDecal = generateDecal(decal.material.map, section, section.userData.point, section.userData.euler, this.size, this.id)
        
        this.position.copy(newDecal.userData.point)
        this.rotation.copy(newDecal.userData.euler)
        
        section.remove(decal)
        section.add(newDecal)

        this.update()
        this.addCornerCircles()

        this.updateDecalData(newDecal)
        this.decal = newDecal
        this.decal.helper = this
        this.decal.customType = "sticker"

    }

    updateRotationUsingAngle(inAngle, inSize = null) {
        let section = this.parent

        this.rotation.z = inAngle

        let decal = this.decal
        let size = inSize ? inSize : decal.userData.size
        let newDecal = generateDecal(decal.material.map, section, decal.userData.point, this.rotation, size, this.id)
        this.updateDecalData(newDecal)
       
        section.remove(decal)
        section.add(newDecal)
        this.decal = newDecal
        this.decal.helper = this
        this.decal.customType = "sticker"
    }
    addLayerToHelper(inLayer) {
        this.rotationHelper.layers.enable(inLayer)
        this.translateHelper.layers.enable(inLayer)
        this.cornerPoints.forEach(e => e.layers.enable(inLayer))
    }
    removeLayerFromHelper(inLayer) {
        this.rotationHelper.layers.disable(inLayer)
        this.translateHelper.layers.disable(inLayer)
        this.cornerPoints.forEach(e => e.layers.disable(inLayer))
    }
    // editRawImage(inThreshold, isInvert) {
    //     let element = this.decal
    //     this.threshold = inThreshold

    //     return new Promise(async (resolve, reject) => {

    //         let fileSrc = element.userData.imageProcess

    //         if (!fileSrc) {
    //             resolve(0)
    //             return
    //         }
    //         let imageProcess = element.userData.imageProcess
    //         await imageProcess.generate()

    //         imageProcess.setMonochromeThreshold(inThreshold)
    //         let monochrome = imageProcess.getMonochromeImage(isInvert)
    //         imageProcess.release()

    //         let data = {
    //             monochrome: monochrome,
    //             imageProcess: imageProcess,
    //             threshold: inThreshold
    //         }
    //         element.userData.imageProcess = data.imageProcess
    //         element.userData.effectData.contrast = data.imageProcess.getMonochromeThreshold()

    //         element.userData.effectData.isInverted = isInvert

    //         let svgImage = await imageToSvgPath(monochrome);
    //         svgImage = NL3DUtils.updateBoundingBoxWidthHeight(svgImage)

    //         let ratio = NL3DUtils.findAspectRatio(svgImage)
    //         let changeSvg = NL3DUtils.resizeSvg(svgImage, 50, 50 / ratio)

    //         const dataURI = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(changeSvg)}`;
    //         let imgData = await NL3DUtils.invertColorAndMakePng(null, dataURI);

    //         element.userData.svg = imgData
    //         element.userData.svgString = changeSvg


    //         let img = new Image();
    //         img.src = imgData

    //         img.onload = function () {
    //             let imgTxt = new THREE.TextureLoader().load(imgData)
    //             element.material.map = imgTxt
    //             resolve(1)
    //         }
    //     })
    // }
}

export function createLineSegment(inPoints, inColor = "green", outline = true) {
    debugger
    console.log(inPoints,"inPOints")
    const geometry = new LineGeometry();
    let positions = [];
    for (let i = 0; i < inPoints.length; i++) {
        positions.push(inPoints[i].x, inPoints[i].y, inPoints[i].z ? inPoints[i].z + .001 : .001);
    }
    geometry.setPositions(positions);
    
    const material = new LineMaterial({
        color: "white",
        linewidth: .001,
        // Additional properties as needed
    });
    
    const line = new Line2(geometry, material);
    line.computeLineDistances();
    
    if (outline) {
        const outlineMaterial = new LineMaterial({
            color: "black", // Outline color
            linewidth: .003, // Slightly thicker than the main line
            transparent: true,
            opacity: 0.3
            // Additional properties as needed
        });
        const outlineLine = new Line2(geometry, outlineMaterial);
        outlineLine.computeLineDistances();
        outlineLine.position.z -= 0.001; // Render behind the main line
        
        // Grouping the outline and the line
        const group = new THREE.Group();
        group.add(outlineLine);
        group.add(line);
        return group;
    } else {
        return line;
    }
}

