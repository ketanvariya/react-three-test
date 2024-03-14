import * as THREE from 'three'
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry';
import makerjs from 'makerjs';
import { pathBounds } from './SvgBounds.js';
import svgpath from 'svgpath';
import { DecalMesh } from './DecalMesh.js';
import { ElementDecal } from './ElementDecal.js';
import { ImageProcess } from './imageUtils/ImageProcess.js';

export function addRefSphere(inPosition, inParent, inColor = "red") {
    let sphereGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    let sphereMaterial = new THREE.MeshBasicMaterial({ color: inColor });
    let sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphereMesh.position.copy(inPosition)
    sphereMesh.name = "refSphere"
    inParent.add(sphereMesh)
}
export function getIntersection(threeViewer, model, inlayerArr, inMouse) {
    const raycaster = new THREE.Raycaster();

    raycaster.layers.disableAll();
    inlayerArr.forEach(layer => {
        raycaster.layers.enable(layer);
    });

    // Set up the raycaster
    let mouse = inMouse ? inMouse : threeViewer.mouse
    raycaster.setFromCamera(mouse, threeViewer.camera);

    // Check for intersections between the ray and the model
    let intersects = raycaster.intersectObject(model, true);
    if (intersects.length > 0) {

        // If helperPlane is intersected, check for other intersections
        if (intersects[0].object.name === "helperPlane") {
            for (let index = 0; index < intersects.length; index++) {
                const element = intersects[index];
                
                if (element.object.parent === threeViewer.selectedDecalHelper) {
                    return element
                }
            }
        }
        
        return intersects[0];
    }
    return null;
}

export function plotVectorOnXZPlane(inVector) {
    let plottedVector = inVector.clone()
    plottedVector.y = 0
    return plottedVector
}
// eslint-disable-next-line no-extend-native
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

export function downloadJSON(inData) {
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(inData));
    let link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", "data.json");
    link.click();
    link.remove()
}


export function resizeSvg(inSvgString, inWidth, inHeight) {
    // return svg string with updated width and height
    let svgString = inSvgString;
    svgString = svgString.replace(/width=".*?"/, `width="${inWidth}"`);
    svgString = svgString.replace(/height=".*?"/, `height="${inHeight}"`);

    return svgString;
}
export function invertColorAndMakePng(inViewer, inSvg) {
    return new Promise((resolve, reject) => {
        // let newArr = [...inViewer.sections]
        // inViewer.setSections1(newArr)
        // Create a new Image object
        const svgImage = new Image();

        // Set the source of the SVG image
        svgImage.src = inSvg;

        // When the SVG image has finished loading
        svgImage.onload = function () {
            // Create a canvas element with increased dimensions for higher quality
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            // Set the canvas dimensions to increase the quality (e.g., multiply by a factor)
            const qualityMultiplier = 20; // Increase the quality by 2 times
            canvas.width = svgImage.width * qualityMultiplier;
            canvas.height = svgImage.height * qualityMultiplier;

            // Draw the SVG image onto the canvas with improved quality
            context.drawImage(svgImage, 0, 0, canvas.width, canvas.height);

            // Get the pixel data from the canvas
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Iterate through each pixel and invert its color
            for (let i = 0; i < data.length; i += 4) {
                const red = data[i];
                const green = data[i + 1];
                const blue = data[i + 2];

                if (red < 50 && green < 50 && blue < 50) {
                    data[i] = 255;
                    data[i + 1] = 255;
                    data[i + 2] = 255;
                }

                if (red > 200 && green > 200 && blue > 200) {
                    data[i + 3] = 0;
                }
            }

            // Put the modified pixel data back to the canvas
            context.putImageData(imageData, 0, 0);

            // Convert the canvas image to a PNG data URL
            const pngDataUrl = canvas.toDataURL('image/png');
            resolve(pngDataUrl)
        };
    })

}

export function generateDecal(texture, inObject, inPoint, inEuler, size, inElementId) {
    
    return new ElementDecal(inObject, inPoint, inEuler, size, texture, inElementId)
}

export function removeObjectWithChildren(object) {
    /**
     * This function removes an object from the scene and disposes of its geometry and material
     * @param {THREE.Object3D}
     * @returns {void}
    */

    if (!object) return

    for (let i = object.children.length - 1; i >= 0; i--) {
        removeObjectWithChildren(object.children[i])
    }
    object.parent.remove(object)
    if (object.geometry) object.geometry.dispose()
    if (object.material) object.material.dispose()
    if (object.texture) object.texture.dispose()
    if (object.element) object.element.remove()
}

export function findAspectRatio(svgCode) {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = svgCode;
    const svgElement = tempElement.querySelector("svg");
    if (svgElement && svgElement.hasAttribute("width") && svgElement.hasAttribute("height")) {
        const width = parseFloat(svgElement.getAttribute("width"));
        const height = parseFloat(svgElement.getAttribute("height"));
        const aspectRatio = width / height;
        return aspectRatio;
    } else {
        return null;
    }
}

export function getDxfStringFromSVGFirstPath(inSvgString) {

    let svgPathData = getPathFromSVG(inSvgString)
    if(!svgPathData) {
        alert("No path found in SVG")
        return
    }
    let makerJsPath = makerjs.importer.fromSVGPathData(svgPathData)
    let dxfString = makerjs.exporter.toDXF(makerJsPath, { optcurve: false, usePOLYLINE: true, units: "millimeter" , accuracy:0.001  })

    var blob = new Blob([dxfString], { type: "application/octet-stream" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "exportedDXF.dxf";
    a.click();
    return dxfString
}
export function findCenter(inSVGPath) {
    const [left, top, right, bottom] = pathBounds(inSVGPath)
    const center = new THREE.Vector2()
    center.x = (left + right) / 2
    center.y = (top + bottom) / 2
    return center
}
export function reScalePathTotoNewBounds(path, inWidth, inHeight, inRotateAngle) {
    const [left, top, right, bottom] = pathBounds(path)
    const width = right - left
    const height = bottom - top
    let originalPathCenter = findCenter(path)

    // Translate path to origin
    let translatedPath = svgpath(path).translate(-originalPathCenter.x, -originalPathCenter.y).toString();
    path = translatedPath

    const scale = Math.min(inWidth / width, inHeight / height)

    const scaledPath = svgpath(path).scale(scale).toString();
    const rotatedPath = svgpath(scaledPath).rotate(-inRotateAngle * 180 / Math.PI).toString();

    let makerJsPath = makerjs.importer.fromSVGPathData(rotatedPath)
    let dxfString = makerjs.exporter.toDXF(makerJsPath, { optcurve: false, usePOLYLINE: true, units: "millimeter", accuracy: 0.001 })


    // Find bbox of dxf
    let bbox = makerjs.measure.modelExtents(makerJsPath)
    let dxfWidth = bbox.high[0] - bbox.low[0]
    let dxfHeight = bbox.high[1] - bbox.low[1]
    dxfWidth = removeFloatError(dxfWidth, 3)
    dxfHeight = removeFloatError(dxfHeight, 3)

    // find center
    let centerDxf = findCenter(rotatedPath)

    let v3 = new THREE.Vector3(-centerDxf.x, centerDxf.y, 0.04)
    v3.multiplyScalar(-0.001) // convert to meter, because dxf is in mm, and -1 because we want to move it to the center of the sticker
    
    return { dxfString, dxfWidth, dxfHeight, center: v3 }
}

export function getPointFromBufferGeometry(inBufferGeometry, inIndex) {
    let position = inBufferGeometry.attributes.position
    let x = position.getX(inIndex)
    let y = position.getY(inIndex)
    let z = position.getZ(inIndex)
    return new THREE.Vector3(x, y, z)
}

export function createPlaneFromSection(inSection) {
    let plane = new THREE.Plane()
    let v1 = getPointFromBufferGeometry(inSection.geometry, 0)
    let v2 = getPointFromBufferGeometry(inSection.geometry, 1)
    let v3 = getPointFromBufferGeometry(inSection.geometry, 2)

    inSection.localToWorld(v1)
    inSection.localToWorld(v2)
    inSection.localToWorld(v3)

    plane.setFromCoplanarPoints(v1, v2, v3)
    return plane
}

export function removeFloatingPointErrorVec3(inVec,inDecimals = 2) {
    let x = removeFloatError(inVec.x,inDecimals)
    let y = removeFloatError(inVec.y,inDecimals)
    let z = removeFloatError(inVec.z,inDecimals)
    return new THREE.Vector3(x,y,z)
}

export function removeFloatError(value, decimals = 2) {
    let multiplier = Math.pow(10, decimals || 0);
    return Math.round(value * multiplier) / multiplier;
}

export function getPathFromSVG(inSvgString) {
    // Assuming you have the SVG string stored in a variable named 'svgString'

    // Create a temporary HTML element to parse the SVG string
    const tempElement = document.createElement("div");
    tempElement.innerHTML = inSvgString;

    // Get the first path element inside the temporary element
    const firstPathElement = tempElement.querySelector("path");

    if (!firstPathElement) return
    // Get the 'd' attribute (path data) of the first path element
    const pathData = firstPathElement.getAttribute("d");

    return pathData;
}
export function generateUUID() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

export function sendRequestForModifiedData(inModificationId) {
   
    var message = {
        "modification_id": inModificationId
    }
    window.parent.postMessage(message, "*");
}

export function getQueryParam(params, prop)  {
    const urlParams = new URLSearchParams(params);
    let base_price = urlParams.get(prop)
    return base_price
}

export function getProductDataFromUrl() {
    let variantId = getQueryParam(window.location.search, "variant_id");
    let productId = getQueryParam(window.location.search, "product_id");
    let storeName = getQueryParam(window.location.search, "store_name");

    return { variantId, productId, storeName }
}

export function updateBoundingBoxWidthHeight(inSvgString) {

    let svgPathData = getPathFromSVG(inSvgString)
    if(!svgPathData) {
        console.warn("No path found in SVG")
        return inSvgString
    }
    const [left, top, right, bottom] = pathBounds(svgPathData)
    const width = right - left
    const height = bottom - top
    let svgString = inSvgString;
    svgString = svgString.replace(/width=".*?"/, `width="${width}"`);
    svgString = svgString.replace(/height=".*?"/, `height="${height}"`);
    // update viewBox
    let viewBox = `viewBox="${left} ${top} ${width} ${height}"`
    svgString = svgString.replace(/viewBox=".*?"/, viewBox);

    return svgString;

}

export function removeFloatErrorVec3(inVec, inDecimals = 2) {
    let x = removeFloatError(inVec.x, inDecimals)
    let y = removeFloatError(inVec.y, inDecimals)
    let z = removeFloatError(inVec.z, inDecimals)
    return new THREE.Vector3(x,y,z)
}

export function adjustSnappingVec(inVec, inSnapping) {
    let x = adjustSnapping(inVec.x, inSnapping)
    let y = adjustSnapping(inVec.y, inSnapping)
    let z = adjustSnapping(inVec.z, inSnapping)
    return new THREE.Vector3(x, y, z)
}

export function adjustSnapping(inValue, inSnapping) {
    let value = inValue
    let snapping = inSnapping
    let remainder = value % snapping
    if (remainder < snapping / 2) {
        value -= remainder
    } else {
        value += snapping - remainder
    }
    return value
}

export function convertToSingleDecimal(floatValue) {
    // Round the float value to the nearest multiple of 0.5
    const roundedValue = Math.round(floatValue * 2) / 2;
    return roundedValue;
}

export function convertToSingleDecimalVec3(inVec) {
    let x = convertToSingleDecimal(inVec.x)
    let y = convertToSingleDecimal(inVec.y)
    let z = convertToSingleDecimal(inVec.z)
    return new THREE.Vector3(x,y,z)
}

export function getSVGFromUrl(inUrl) {
    return new Promise((resolve, reject) => {
        fetch(inUrl)
            .then((res) => res.text())
            .then((data) => {
                resolve(data)
            })
    })
}

export function convertToBlackAndWhite(src, inThreshold) {
    return new Promise(async (resolve, reject) => {

        let imageProcess = new ImageProcess(src)
        await imageProcess.generate()

        if (inThreshold) {
            imageProcess.setMonochromeThreshold(inThreshold)
        }

        let monochrome = imageProcess.getMonochromeImage()

        let threshold = imageProcess.getMonochromeThreshold()

        // Release memory of imageProcess
        imageProcess.release()
        let result = {
            monochrome,
            threshold,
            imageProcess
        }
       
        resolve(result)
    });
}

export function applyTransformationToPath(path, inWidth, inHeight,inTranslation, inRotateAngle) {
    const [left, top, right, bottom] = pathBounds(path)
    const width = right - left
    const height = bottom - top
    let originalPathCenter = findCenter(path)

    // Translate path to origin
    let centeredPath = svgpath(path).translate(-originalPathCenter.x, -originalPathCenter.y).toString();
    path = centeredPath

    const scale = Math.min(inWidth / width, inHeight / height)

    const scaledPath = svgpath(path).scale(scale).toString();
    const rotatedPath = svgpath(scaledPath).rotate(-inRotateAngle * 180 / Math.PI).toString();

    let translatedPath = svgpath(rotatedPath).translate(inTranslation.x, -inTranslation.y).toString();
    return translatedPath
    
}
export function convertSVGToDxfData(inSvgPathData) {
    
    let makerJsPath = makerjs.importer.fromSVGPathData(inSvgPathData)
    let dxfString = makerjs.exporter.toDXF(makerJsPath, { optcurve: false, usePOLYLINE: true, units: "millimeter", accuracy: 0.001 })

    // Find bbox of dxf
    let bbox = makerjs.measure.modelExtents(makerJsPath)
    let dxfWidth = bbox.high[0] - bbox.low[0]
    let dxfHeight = bbox.high[1] - bbox.low[1]
    dxfWidth = removeFloatError(dxfWidth, 3)
    dxfHeight = removeFloatError(dxfHeight, 3)

    // find center
    let centerDxf = findCenter(inSvgPathData)

    let v3 = new THREE.Vector3(-centerDxf.x, centerDxf.y, 0)
    v3.multiplyScalar(-0.001) // convert to meter, because dxf is in mm, and -1 because we want to move it to the center of the sticker
    return { dxfString, dxfWidth, dxfHeight, center: v3 }
}
export function getSvgWithPathBounds(inSvgPathData) {
    const [left, top, right, bottom] = pathBounds(inSvgPathData)

    const width = right - left
    const height = bottom - top

    let originPath = svgpath(inSvgPathData).translate(-left, -top).toString();
    const [left1, top1, right1, bottom1] = pathBounds(originPath)
    const width1 = right1 - left1
    const height1 = bottom1 - top1

    let svgString = `<svg width="${width1}" height="${height1}" fill-rule="evenodd" viewBox="${left1} ${top1} ${width1} ${height1}" xmlns="http://www.w3.org/2000/svg">
    <path d="${originPath}" fill="#C0C0C0" stroke="black" stroke-width="0"/>
    </svg>`

    let topLeftPoint = [left, top]
    let bottomRightPoint = [right, bottom]
    return {
        topLeftPoint,
        svgString,
        bottomRightPoint,
        width,
        height
    }
}
export function removeWhiteSpaceFromSvg(inSvgString) {
    let svgPath = getPathFromSVG(inSvgString)
    let svgBounds = pathBounds(svgPath)

    //Move svg to left top corner
    let translatedSvgPath = svgpath(svgPath).translate(-svgBounds[0], -svgBounds[1]).toString()

    let newBounds = pathBounds(translatedSvgPath)

    let newWidth = newBounds[2] - newBounds[0]
    let newHeight = newBounds[3] - newBounds[1]

    let svg = `<svg width="${newWidth}" height="${newHeight}" fill-rule="evenodd" viewBox="${newBounds[0]} ${newBounds[1]} ${newWidth} ${newHeight}" xmlns="http://www.w3.org/2000/svg">
    <path d="${translatedSvgPath}" fill="#C0C0C0" stroke="black" stroke-width="0"/>
    </svg>`

    return svg
}


export function setAllMaterialSide(inObject, side) {
    if(!inObject) return

    if (!inObject.isObject3D) return

    inObject.traverse(function (child) {
        if (child.isMesh) {
            child.material.side = side;
        }
    });
}