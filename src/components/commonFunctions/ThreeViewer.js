import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

var scopeViewer
class ThreeViewer {
    constructor(params) {
        this.params = params
        this.element = params.element
        this.canvasWidth = this.element.clientWidth
        this.canvasHeight = this.element.clientHeight
        this.camera = new THREE.PerspectiveCamera(50, this.canvasWidth / this.canvasHeight, 0.1, 10000)
        this.scene = new THREE.Scene()

        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        })
        this.labelRenderer = new CSS2DRenderer()
        this.controls = null
        this.mouse = new THREE.Vector2()
        this.pickingObjects = []

        this.timer = 0;
        this.delay = 100;
        this.prevent = false;
        scopeViewer = this
    }
    initViewer() {
        this.scene.background = new THREE.Color(this.params.bgColor || "rgb(112, 114, 115)")
        this.scene.add(this.camera)
        this.camera.position.set(3, 3, 3)
        this.renderer.setSize(this.canvasWidth, this.canvasHeight)
        this.element.appendChild(this.renderer.domElement)
        this.renderer.domElement.id = "mainCanvas"
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)

        this.labelRenderer.domElement.style.position = 'absolute'
        this.labelRenderer.domElement.style.top = '0px'
        this.labelRenderer.domElement.style['pointer-events'] = 'none'
        this.element.appendChild(this.labelRenderer.domElement)

        this.labelRenderer.setSize(this.canvasWidth, this.canvasHeight)

        window.addEventListener('resize', this.onWindowResize, false);
        this.renderer.domElement.addEventListener('click', this.onclick)
        this.renderer.domElement.addEventListener('pointermove', this.onMouseMove);
        this.animate()

    }
    onWindowResize() {
        scopeViewer.clientWidth = scopeViewer.element.clientWidth
        scopeViewer.clientHeight = scopeViewer.element.clientHeight
        scopeViewer.camera.aspect = scopeViewer.clientWidth / scopeViewer.clientHeight;
        scopeViewer.camera.updateProjectionMatrix();
        scopeViewer.renderer.setSize(scopeViewer.clientWidth, scopeViewer.clientHeight);
        scopeViewer.labelRenderer.setSize(scopeViewer.canvasWidth, scopeViewer.canvasHeight)
    }
    render() {
        this.renderer.render(this.scene, this.camera);
        this.labelRenderer.render(this.scene, this.camera);
        this.controls.update()
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.render();
    }
    
    onclick(event) {
        scopeViewer.timer = setTimeout(function () {
            if (!scopeViewer.prevent) {
                scopeViewer.mouse.x = ((event.clientX - (scopeViewer.element.getBoundingClientRect().left)) / scopeViewer.element.clientWidth) * 2 - 1;
                scopeViewer.mouse.y = - ((event.clientY - (scopeViewer.element.getBoundingClientRect().top)) / scopeViewer.element.clientHeight) * 2 + 1;
                // checkIntersectionclick(event);
                if (scopeViewer.intersectionCallback) {
                    scopeViewer.intersectionCallback()
                }
            }
            scopeViewer.prevent = false;
        }, scopeViewer.delay);
    }
    try(input) {
        console.log('input')
        console.log(input)
    }
    onMouseMove(event) {

        scopeViewer.prevent = true
        setTimeout(() => {
            scopeViewer.prevent = false
        }, scopeViewer.delay);

    }

}

export { ThreeViewer };
