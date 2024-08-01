import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function findDistanceBetweenTwoPoints(firstPoint, secondPoint) {
    return firstPoint.distanceTo(secondPoint);
}

export function loadGLTF(inFile) {
    return new Promise((resolve, reject) => {
        let loader = new GLTFLoader()

        loader.load(inFile, (gltf) => {
            resolve(gltf.scene)
        }, () => {

        }, (error) => {
            resolve(error)
        }
        )
    })
}
