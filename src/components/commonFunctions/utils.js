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
