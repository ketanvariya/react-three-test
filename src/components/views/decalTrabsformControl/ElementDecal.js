import { DecalMesh } from './DecalMesh.js';
import { saveFileToGCS } from './saveFileToGCS.js';
import * as THREE from 'three';

let uniqueId = 1;
export class ElementDecal extends DecalMesh {
    
    constructor(inObject, inPoint, inEuler, size, texture, inElementId) {
        // Update z size to adjust z size of decal 
        let originPlane = inObject.originPlane;
        let distance = originPlane.distanceToPoint(inPoint);
        size.z = distance;

        super(inObject, inPoint, inEuler, size, texture);
        this.customType = "element";
        this.elementId = inElementId//uniqueId++;
        this.point = inPoint;
        // this.addHelper();
        // this.addCenter();
    }
    addHelper() {
        this.helper = new THREE.BoxHelper(this, 0xffff00);
        this.helper.visible = true;
        this.add(this.helper);
    }
    addCenter() {
        this.center = new THREE.Mesh(new THREE.SphereGeometry(0.001, 32, 32), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
        this.center.visible = true;
        this.center.position.copy(this.point)
        this.add(this.center);
    }
    getSection() {
        return this.parent;
    }
    getRawImage() {
        if (this.userData.imageProcess) return this.userData.imageProcess.getRawImage();

        return this.userData.svg;
    }
    updateEffectData() {
        if (!this.userData.imageProcess) return
        this.userData.effectData = {
            contrast: this.userData.imageProcess.getMonochromeThreshold(),
            minContrast: this.userData.imageProcess.getMinThreshold(),
            maxContrast: this.userData.imageProcess.getMaxThreshold(),
            isInverted: Boolean(this.userData.effectData?.isInverted)
        }
    }
    async saveRawImage(inName, inModificationId) {
        if (!inModificationId) throw new Error("Modification id is required")

        let rawImage = this.getRawImage();

        // Decode the base64 data from the data URI
        const base64Data = rawImage.split(',')[1];

        // Create a buffer from the base64 data
        const buffer = Buffer.from(base64Data, 'base64');

        // Get store name from url
        const urlParams = new URLSearchParams(window.location.search);
        let storeName = urlParams.get("store_name")

        // Get modification id from url
        let url = await saveFileToGCS(`${inName}.png`, buffer, storeName, inModificationId)

        // // Download the buffer as a png
        // let blob = new Blob([buffer], { type: 'image/png' });
        // let a = document.createElement('a');
        // a.href = window.URL.createObjectURL(blob);

        // // Give filename you wish to download
        // a.download = "test.png";

        // a.click();
        return url;

    }
}
