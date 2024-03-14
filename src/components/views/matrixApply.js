import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { addRefSphere } from './decalTrabsformControl/NL3DUtils';

export function matrixApply(threeViewer){
    console.log("hey");

    var transformMatrix = new THREE.Matrix4();
    transformMatrix.set(
        0.7487190757342765, 0.6628874305880379, -1.1102230246251565e-16, 0,
        0.3054254668179078, -0.3449724080885903, 0.8875298991451628, 0,
        0.5883324144143971, -0.6645105657745018, -0.46075012547299193, 0,
        3755139.893800329, -4241360.962365829, -2921135.4752492253, 1
    );
    transformMatrix.transpose()

    transformMatrix.invert();

    // Convert points EPSG :4978
    let points = [
        {
            "x": 3755129.8060501693,
            "y": -4241388.077213537,
            "z": -2921150.574008294
        },
        {
            "x": 3755140.1246242044,
            "y": -4241378.359179742,
            "z": -2921160.162032002
        },
        {
            "x": 3755146.4713338064,
            "y": -4241375.915084465,
            "z": -2921148.5280257966
        },
        {
            "x": 3755145.1142616523,
            "y": -4241379.740303217,
            "z": -2921143.9591009724
        },
        {
            "x": 3755139.5287847854,
            "y": -4241383.508459126,
            "z": -2921141.4735384593
        },
        {
            "x": 3755133.600217557,
            "y": -4241388.378200901,
            "z": -2921142.2776273093
        },
        {
            "x": 3755130.0896616755,
            "y": -4241389.487757462,
            "z": -2921146.9982013525
        }
    ];

    let transformedPoints = [];

    points.forEach(point => {
        let vector3 = new THREE.Vector3(point.x, point.y, point.z);
        vector3.applyMatrix4(transformMatrix);
        transformedPoints.push(vector3);
        addRefSphere(vector3,threeViewer.scene)
    });

    console.log(transformedPoints,"transformedPoints");

}
export function matrixApply2(){
    console.log("hey");

    var transformMatrix = new THREE.Matrix4();
    transformMatrix.set(
        0.7487190757342765, 0.6628874305880379, -1.1102230246251565e-16, 0,
        0.3054254668179078, -0.3449724080885903, 0.8875298991451628, 0,
        0.5883324144143971, -0.6645105657745018, -0.46075012547299193, 0,
        3755139.893800329, -4241360.962365829, -2921135.4752492253, 1
    );
    transformMatrix.transpose()

    transformMatrix.invert();

    
    let points = [
        {
            "x": 3755188.589959738,
            "y": -4241375.075120639,
            "z": -2921101.2724095453
        },
        {
            "x": 3755203.148607892,
            "y": -4241374.954096585,
            "z": -2921082.93375605
        },
        {
            "x": 3755214.3881039433,
            "y": -4241361.422121102,
            "z": -2921090.346563332
        },
        {
            "x": 3755197.2748129647,
            "y": -4241386.382954112,
            "z": -2921076.480988807
        }
    ];

    let transformedPoints = [];

    points.forEach(point => {
        let vector3 = new THREE.Vector3(point.x, point.y, point.z);
        vector3.applyMatrix4(transformMatrix);
        debugger
        transformedPoints.push(vector3);
    });

    console.log(transformedPoints,"transformedPoints");

}

export function loadObj(threeViewer){
    const loader = new OBJLoader();
    console.log(loader,"loader")
    loader.load(
        'http://localhost:3001/assets/obra_obj/odm_textured_model_geo.obj',
        function (object) {
            // Add the loaded object to the scene
            threeViewer.scene.add(object);
            object.traverse(function (child) {
                // change material
                if (child.isMesh) {
                    child.material = new THREE.MeshPhongMaterial({
                        // color: 0x00ff00,
                    })
                }
            })
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.error('An error happened', error);
        }
    );
}

// ceseium volume start
// addLights(threeViewer.scene)
// loadObj(threeViewer)
// matrixApply(threeViewer)
// ceseium volume end