export class ImageProcess {
    constructor(inSrc) {
        this.src = inSrc;
    }
    async generateImage() {
        let scope = this;
        scope.canvas = document.createElement('canvas');
        const ctx = scope.canvas.getContext('2d');
        const image = new Image();
        image.src = scope.src;
        await new Promise((resolve) => (image.onload = resolve));

        scope.width = image.width;
        scope.height = image.height;

        scope.canvas.width = image.width;
        scope.canvas.height = image.height;

        ctx.drawImage(image, 0, 0);
        scope.imageData = ctx.getImageData(0, 0, scope.canvas.width, scope.canvas.height);
    }
    async generate() {
        let scope = this;
        await scope.generateImage();

        const data = scope.imageData.data;

        scope.isGreyScale = true;
        scope.min = 255
        scope.max = 0
        scope.avg = 0;
        let count = 0;

        for (let i = 0; i < data.length; i += 4) {
            if(scope.isGreyScale){
                if (data[i] !== data[i + 1] || data[i] !== data[i + 2]) {
                    scope.isGreyScale = false;
                }
            }
            let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            avg = Math.round(avg)
            if(avg !== 0 && avg !== 255){
                scope.min = Math.min(scope.min, avg)
                scope.max = Math.max(scope.max, avg)
                scope.avg += avg
                count++;
            }
        }
        scope.min = Math.round(scope.min)
        scope.max = Math.round(scope.max)
        scope.range = scope.max - scope.min;
     
        scope.avg = scope.avg / (count ? count : 1)
        scope.monochromeThreshold = scope.avg + 1; // added 1 to make sure it is not equal to the average
    }
    release() {
        this.canvas = null;
        this.imageData = null;
    }
    getIsGreyScale() {
        return this.isGreyScale;
    }
    getMinThreshold() {
        return this.min;
    }
    getMaxThreshold() {
        return this.max;
    }
    getThresholdRange() {
        return this.range;
    }
    getAvg() {
        return this.avg;
    }
    setMonochromeThreshold(inThreshold) {
        this.monochromeThreshold = inThreshold;
    }
    getMonochromeThreshold() {
        return this.monochromeThreshold;
    }
    getMonochromeImage(isInvert = false) {
        let scope = this;

        let canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = scope.canvas.width;
        canvas.height = scope.canvas.height;

        let newImageData = ctx.createImageData(scope.canvas.width, scope.canvas.height);

        newImageData.data.set(scope.imageData.data);

        const data = newImageData.data;

        for (let i = 0; i < data.length; i += 4) {
            let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            avg = Math.round(avg)
            if (avg < scope.monochromeThreshold) {
                let val = isInvert ? 255 : 0;
                data[i] = val
                data[i + 1] = val
                data[i + 2] = val
            } else {
                let val = isInvert ? 0 : 255;
                data[i] = val
                data[i + 1] = val
                data[i + 2] = val
            }
        }
        ctx.putImageData(newImageData, 0, 0);
        const convertedSrc = canvas.toDataURL();

        return convertedSrc;

    }
    getRawImage() {
        return this.src;
    }
}