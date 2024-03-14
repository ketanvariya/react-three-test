import * as THREE from 'three'
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';


export function createLineSegment(inPoints,color = 0xffffff, dashed = false) {

    /**
     * This function creates a line segment from a list of points
     * Make sure the points are in the correct order
     * @param {Array<THREE.Vector3>} inPoints
     * @returns {THREE.Line}
     */

    // const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
    // const geometry = new THREE.BufferGeometry().setFromPoints(inPoints);
    // const line = new THREE.Line(geometry, material);
    // return line

    const geometry = new LineGeometry();
    let positions = []
    // let colors = []
    for (let i = 0; i < inPoints.length; i++) {
        positions.push(inPoints[i].x, inPoints[i].y, inPoints[i].z? inPoints[i].z : 0)
        // colors.push(1, 0, 0)
    }

    geometry.setPositions(positions);
    // geometry.setColors(colors);

    const material = new LineMaterial({

        color: new THREE.Color(color),
        linewidth: .005, // in world units with size attenuation, pixels otherwise
        // vertexColors: true,

        //resolution:  // to be set by renderer, eventually
        dashed: dashed,
        alphaToCoverage: true,

    });
    // const geometry = new THREE.BufferGeometry().setFromPoints(inPoints);
    const line = new Line2(geometry, material);
    line.computeLineDistances();

    return line
}

export function createThinLine(inPoints,color = 0xffffff,){
    /**
     * This function creates a thin(MeshBasicMaterial) line segment from a list of points
     * Make sure the points are in the correct order
     * @param {Array<THREE.Vector3>} inPoints
     * @returns {THREE.Line}
     */
    let pointsArray = []

    for (let i = 0; i < inPoints.length; i++) {
        let p = inPoints[i];
        pointsArray.push(p.x, p.y, p.z? p.z : 0)
    }

    // Create geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(pointsArray);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    // Create material
    const material = new THREE.LineBasicMaterial({ color: color });
    
    // Create line and add to scene
    const line = new THREE.Line(geometry, material);
    line.layers.set(4) // Entity reference layer
    line.name = "perimeterBorder"
    return line
}

export function generateRandomTriangle() {
    /**
     * This function generates a random triangle
     * @returns {Array<THREE.Vector3>}
     */
    let points = []
    for (let i = 0; i < 3; i++) {
        points.push(new THREE.Vector3(Math.random() * 10, Math.random() * 10, Math.random() * 10))
        // points.push(new THREE.Vector3(Math.random() * 10, 0, Math.random() * 10))
    }
    return points
}
export function getNormalFrom3Points(a, b, c) {
    /**
     * This function returns the normal of a triangle
     */
    let ab = new THREE.Vector3().subVectors(b, a)
    let ac = new THREE.Vector3().subVectors(c, a)
    let normal = new THREE.Vector3().crossVectors(ab, ac).normalize()

    return normal
}

export function createArrow(origin, normal) {
    /**
     * This function creates an arrow helper
     * @param {THREE.Vector3}
     * @param {THREE.Vector3}
     * @returns {THREE.ArrowHelper}
     */

    let arrowHelper = new THREE.ArrowHelper(normal, origin, 10, 0xff0000)
    return arrowHelper
}
export function getQuaternionFromNormalVec(vector) {
    /**
     * This function returns a quaternion from a normal vector
     * @param {THREE.Vector3}
     * @returns {THREE.Quaternion}
     *  */

    let normal = new THREE.Vector3(0, 0, 1)
    let axis = new THREE.Vector3().crossVectors(vector, normal).normalize()
    let angle = Math.acos(vector.dot(normal))
    let quaternion = new THREE.Quaternion().setFromAxisAngle(axis, angle)
    return quaternion
}
export function findCentroid(inPoints) {
    /**
     * This function finds the centroid of a list of points
     * @param {Array<THREE.Vector3>}
     * @returns {THREE.Vector3}
     * */
    
    let centroid = new THREE.Vector3()
    for (let i = 0; i < inPoints.length; i++) {
        if(i == inPoints.length - 1) continue
        
        centroid.add(inPoints[i])
    }
    centroid.divideScalar(inPoints.length - 1)
    return centroid
}

export function addRefSphere(inPoint, inParent = scene) {
    /**
     * This function adds a reference sphere to the scene
     * @param {THREE.Vector3}
     * @returns {THREE.Mesh}
     * */

    let sphere = new THREE.Mesh(new THREE.SphereGeometry(.5, 32, 32), new THREE.MeshBasicMaterial({ color: 0xff0000 }))
    sphere.position.copy(inPoint)
    inParent.add(sphere)
    return sphere
}

export function removeObjectWithChildren(object) {
    /**
     * This function removes an object from the scene and disposes of its geometry and material
     * @param {THREE.Object3D}
     * @returns {void}
     * */

    if(!object) return
    
    for (let i = object.children.length - 1; i >= 0; i--) {
        removeObjectWithChildren(object.children[i])
    }
    object.parent.remove(object)
    if(object.geometry) object.geometry.dispose()
    if(object.material) object.material.dispose()
    if(object.texture) object.texture.dispose()
    
}

export function createFatLines(inPoints,lineWidth = .007, inColor = 0xff0000) {
    const geometry = new LineGeometry();
    let positions = []
    let colors = []
    for (let i = 0; i < inPoints.length; i++) {
        positions.push(inPoints[i].x, inPoints[i].y, inPoints[i].z)

    }

    geometry.setPositions(positions);

    const material = new LineMaterial({

        color: inColor,
        linewidth: lineWidth, // in world units with size attenuation, pixels otherwise


        //resolution:  // to be set by renderer, eventually
        dashed: false,
        alphaToCoverage: true,

    });
    // const geometry = new THREE.BufferGeometry().setFromPoints(inPoints);
    const line = new Line2(geometry, material);
    line.computeLineDistances();


    return line
}

export function createPlaneHelperFrom3Points(a, b, c) {
    // addRefSphere(a)
    // addRefSphere(b)
    // addRefSphere(c)
    
    /**
     * This function creates a plane helper from 3 points
     * @param {THREE.Vector3}
     * @param {THREE.Vector3}
     * @param {THREE.Vector3}
     * @returns {THREE.PlaneHelper}
     */

    let plane = new THREE.Plane()
    plane.setFromCoplanarPoints(a, b, c)
    let planeHelper = new THREE.PlaneHelper(plane, 10, 0xff0000)
    return planeHelper
}