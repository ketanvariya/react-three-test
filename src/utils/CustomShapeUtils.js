import * as THREE from 'three'

export function createShape(inPoints,inColor = 0xffffff) {
    
    /**
     * This function creates a shape mesh from a list of points
     * Points are assumed to be ordered
     * @param {Array<THREE.Vector3>}
     * @returns {THREE.Mesh}
     * */

    const shape = new THREE.Shape();

    if (inPoints.length > 0) {
        shape.moveTo(inPoints[0].x, inPoints[0].y);
        for (let i = 1; i < inPoints.length; i++) {
            shape.lineTo(inPoints[i].x, inPoints[i].y);
        }
    }

    const geometry = new THREE.ShapeGeometry(shape);

    const mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial(
        {
            side: THREE.DoubleSide,
            color: inColor,
            
            polygonOffset : true,
            polygonOffsetFactor : -1,
            polygonOffsetUnits : 20
        }
    ));
    return mesh
}