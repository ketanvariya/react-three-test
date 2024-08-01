import * as THREE from 'three';
export function calculateAngle(normal1, normal2) {
    console.log(normal1, normal2, "kk");
    // Convert normal vectors to Three.js Vector3 objects
    const vector1 = new THREE.Vector3(normal1.x, normal1.y, normal1.z).normalize();
    const vector2 = new THREE.Vector3(normal2.x, normal2.y, normal2.z).normalize();

    // Calculate the angle between the two normals
    const angle = vector1.angleTo(vector2);

    // Return the angle in radians
    return angle;
}