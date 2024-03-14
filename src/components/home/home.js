import * as THREE from 'three';
// import { acceleratedRaycast, computeBoundsTree, disposeBoundsTree } from 'three-mesh-bvh';
import React, { Component } from 'react'
import { ThreeViewer } from '../commonFunctions/ThreeViewer.js';
import HomeView, { ImageToSvgConverter } from './homeView.jsx'
import { planeMesh, CustomTransformControl } from '../views/customManipulator/manipulator.js';
import { DecalHelper } from '../views/decalTrabsformControl/DecalHelper.js';
import { initRaycastTest } from '../views/raycastTest.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { createCube } from '../views/customUtils/customUtils.js';


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

    }
    render() {
        return (
            <div>
                <HomeView />
            </div>
        )
    }
}


function customTransformControl(threeViewer){
    let planeObj = planeMesh()
    threeViewer.scene.add(planeObj)
    // planeObj.add(DecalHelper) 
    let x = new DecalHelper(planeObj)
    console.log(x,"x+++")
    threeViewer.scene.add(x)
}

function raycasterTest(threeViewer){
    let planeObj = planeMesh()
}

function triggerRightClick(elementId) {
    var element = document.getElementById(elementId);
    if (!element) {
        console.error("Element with id '" + elementId + "' not found.");
        return;
    }

    // Define the right-click handler function
    function handleRightClick(event) {
        // Prevent the default right-click behavior
        event.preventDefault();
        console.log("called right Click")
        // Remove the event listener after handling the right-click
        // element.removeEventListener('contextmenu', handleRightClick);
    }

    // Add the right-click event listener
    element.addEventListener('contextmenu', handleRightClick);

    // Create a right-click event
    var rightClickEvent = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        view: window,
        button: 2, // 2 is the code for the right mouse button
        buttons: 2 // Indicates the right mouse button is pressed
    });

    // Dispatch the right-click event on the element
    element.dispatchEvent(rightClickEvent);
}

function handleRightClick(event) {
    alert('Right-click event detected!');
    // Prevent the default context menu from appearing
    event.preventDefault();
}




