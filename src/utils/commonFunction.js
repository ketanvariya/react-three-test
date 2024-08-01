import * as THREE from 'three'
export class progressBar {
    constructor() {
        this.progressBarEle = document.getElementById("progressBar")
        this.progressBarEle.style = `width:0%;display:block`;
    }
    sleep(inMs) {
        return new Promise(resolve => setTimeout(resolve, inMs));
    }
    async setProgress(percent) {
        let roundP = roundDigit(percent, 0)
        if (roundP) percent = roundP
        this.progressBarEle.style = `width: ${percent}%`;
        this.progressBarEle.innerHTML = percent + "%";
        await this.sleep(0)
    }
    async resetProgress() {
        this.progressBarEle.style = `width:0%;display: none;`;
        this.progressBarEle.innerHTML = 0 + "%";
        await this.sleep(0)
    }
}

export function checkInputTextModalIsOn() {
    /**
     * This function check if any Modal which contain input, is currently active or not
     * @returns {Boolean} 
    */
    let inputModels = ["noteFormModal"]
    let inputEleModalIsOn = false
    inputModels.forEach((modal) => {
        if (inputEleModalIsOn) return
        let check = document.getElementById(modal).classList.contains('show')
        if (check) {
            inputEleModalIsOn = true
            return
        }
    })
    return inputEleModalIsOn
}

export function attachTransformControl(inViewer, obj) {
    if (!obj) return

    let transformControl = inViewer.transformControl

    transformControl.showX = true
    transformControl.showY = true
    transformControl.showZ = false
    // transformControl.setMode('translate');
    transformControl.attach(obj)

}

export function getRandomFiveDigitNumber() {
    const min = 10000; // Smallest 5-digit number (10,000)
    const max = 99999; // Largest 5-digit number (99,999)

    // Math.random() returns a number between 0 (inclusive) and 1 (exclusive)
    // To get a number between min and max (inclusive), we use the following formula:
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
