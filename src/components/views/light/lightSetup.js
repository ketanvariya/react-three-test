import * as THREE from 'three';

export function addLights(scene) {
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.2);
    hemiLight.position.set(0, 20, 0);
    hemiLight.layers.enableAll();
    scene.add(hemiLight);

    const light = new THREE.AmbientLight(0xffffff, 0.2);
    light.layers.enableAll();
    scene.add(light);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.2);
    directionalLight1.position.set(90, 5, 0);
    directionalLight1.castShadow = true
    directionalLight1.castShadow = true;
    directionalLight1.shadowCameraVisible = true;
    directionalLight1.shadow.camera.left = -500;
    directionalLight1.shadow.camera.right = 500;
    directionalLight1.shadow.camera.top = 500;
    directionalLight1.shadow.camera.bottom = -500;
    directionalLight1.shadow.bias = - 0.002;
    directionalLight1.shadow.camera.near = 1;
    directionalLight1.shadow.camera.far = 1000;
    directionalLight1.shadow.mapSize.width = 1024;
    directionalLight1.shadow.mapSize.height = 1024;
    directionalLight1.layers.enableAll();
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.2);
    directionalLight2.position.set(-90, 5, 0);
    directionalLight2.layers.enableAll();
    scene.add(directionalLight2);

    const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.2);
    directionalLight3.position.set(50, 90, 0);
    directionalLight3.layers.enableAll();
    scene.add(directionalLight3);
    // const helper = new THREE.DirectionalLightHelper(directionalLight3, 50);
    // scene.add(helper);

    const directionalLight4 = new THREE.DirectionalLight(0xffffff, 0.2);
    directionalLight4.position.set(0, -90, 0);
    directionalLight4.layers.enableAll();
    scene.add(directionalLight4);

    const directionalLight5 = new THREE.DirectionalLight(0xffffff, 0.2);
    directionalLight5.position.set(0, 0, 90);
    directionalLight5.layers.enableAll();
    scene.add(directionalLight5);

    const directionalLight6 = new THREE.DirectionalLight(0xffffff, 0.2);
    directionalLight6.position.set(0, 0, -90);
    directionalLight6.layers.enableAll();
    scene.add(directionalLight6);
}