import * as THREE from 'three';
// import { acceleratedRaycast, computeBoundsTree, disposeBoundsTree } from 'three-mesh-bvh';
import React, { Component } from 'react'
import { ThreeViewer } from '../commonFunctions/ThreeViewer.js';
import HomeView, { ImageToSvgConverter } from './homeView.jsx'
import { planeShape, CustomTransformControl } from '../views/customManipulator/manipulator.js';
import { DecalHelper } from '../views/decalTrabsformControl/DecalHelper.js';
import { initRaycastTest } from '../views/raycastTest.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { createCube } from '../views/customUtils/customUtils.js';
import { loadObj, matrixApply } from '../views/matrixApply.js';
import { extrudeShape } from '../views/extrudeShape/extrudeShape.js';
import { addLights } from '../views/light/lightSetup.js';
import { extrudeInit, extrudeMash } from '../views/extrudeMesh/extrudeMesh.js';


export default class Home extends Component {
    componentDidMount() {
        console.log("called three.js logic")
        // initiate three here
        let threeViewer = new ThreeViewer({
            element: document.getElementById('container3D')
        })

        threeViewer.initViewer()
        window.threeViewer = threeViewer

        let cubeMesh =  createCube()
        threeViewer.scene.add(cubeMesh)

        extrudeInit(threeViewer)
    }
    render() {
        return (
            <div>
                <HomeView />
            </div>
        )
    }
}






