import * as THREE from 'three'
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry';
import steelMaterial  from "./steelMaterial";
export class DecalMesh extends THREE.Mesh {
    constructor(inObject, inPoint, inEuler, size, texture) {
        
        const isLightLoop = (obj) => {
            if (obj?.name === 'avatar') {
                return obj?.userData?.colorObject;
            }
            if (obj?.type === 'Scene') {
                const avatar = obj.children.find(e => e.name === "avatar");
                return avatar?.userData?.colorObject;
            } else {
                return isLightLoop(obj.parent); // Return the result of the recursive call
            }
        };
        let colorObject = isLightLoop(inObject)
        //if (colorObject === undefined) colorObject = true
        
        
        const newSteel =  steelMaterial(colorObject, texture)
        
        
        const decalGeometry = new DecalGeometry(inObject, inPoint, inEuler, size)
        super(decalGeometry, newSteel);

        this.userData.point = inPoint
        this.userData.size = size
        this.userData.object = inObject
        this.userData.euler = inEuler
        this.decalType = "default"
    }
}