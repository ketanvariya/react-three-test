
import * as THREE from 'three';
let threeViewer
export function manipulatorInit(inViewer) {
    console.log("hello")
    threeViewer = inViewer
}



export class CustomTransformControl {
    constructor(params) {
        this.threeViewer = params.threeViewer
        this.objects = undefined

    }
    attach(obj){
        let scope = this
        scope.object = obj
    }
    detach(){
        let scope = this
        scope.object = undefined
    }
    events(){
        // MouseEvents
    }
}