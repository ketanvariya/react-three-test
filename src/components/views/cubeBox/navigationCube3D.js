import { ThreeViewer } from "../../commonFunctions/ThreeViewer";
import { loadGLTF } from "../utils/threeCommonUtils";
import * as THREE from "three";
export class NavigationCube3D {
    constructor(inElement) {
        this.viewer = new ThreeViewer({
            element: inElement,
            isTransparent: true
        })
        this.init()
    }
    dispatchEvent(eventName) {
        let event = new CustomEvent("viewChange", { detail: { eventName: eventName } })
        document.dispatchEvent(event)
    }
    
    async init() {
        let scope = this
        scope.viewer.initViewer()

        scope.scene = scope.viewer.scene
        scope.camera = scope.viewer.camera

        scope.cube = await loadGLTF("./assets/navigationCube/navigationCube.glb")
        scope.cube.position.set(0, 0, -3)
        scope.viewer.pickingObjects.push(scope.cube)
        scope.camera.add(scope.cube);


        //Add Light
        let light = new THREE.AmbientLight(0xffffff, 2)
        this.viewer.scene.add(light)

        

        scope.viewer.intersectionCallback = () => {
            let mouse = scope.viewer.mouse

            let raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, scope.camera);
            let intersectionClick = raycaster.intersectObjects(scope.viewer.pickingObjects, true);
            
            if (intersectionClick.length > 0) {

                let intersectionObject = intersectionClick[0].object
                switch (intersectionObject.name) {
                    case "top":
                    case "topText":
                        scope.dispatchEvent("top")
                        break;
                    case "bottom":
                    case "bottomText":
                        scope.dispatchEvent("bottom")
                        break;
                    case "left":
                    case "leftText":
                        scope.dispatchEvent("left")
                        break;
                    case "right":
                    case "rightText":
                        scope.dispatchEvent("right")
                        break;
                    case "front":
                    case "frontText":
                        scope.dispatchEvent("front")
                        break;
                    case "rear":
                    case "rearText":
                        scope.dispatchEvent("rear")
                        break;
                    default:
                        break;
                }
            }
        }
    }

    updateCube(inCamera) {
        let mat = new THREE.Matrix4().extractRotation(inCamera.matrixWorldInverse);
        let mat2 = new THREE.Matrix4().makeRotationX(Math.PI / 2);
        mat.multiply(mat2);
        if (this.cube) this.cube.quaternion.setFromRotationMatrix(mat);
    }
}

function createCubeUsingPlaneGeo() {
    let geometry = new THREE.PlaneGeometry(1, 1, 1);
    let topMat = new THREE.MeshPhongMaterial({ color: 0x00ff00, side: THREE.DoubleSide });

    let top = new THREE.Mesh(geometry, topMat);
    top.position.set(0, 0.5, 0)
    top.rotation.x = Math.PI / 2

    let bottomMat = new THREE.MeshPhongMaterial({ color: 0xffff00, side: THREE.DoubleSide });
    let bottom = new THREE.Mesh(geometry, bottomMat);
    bottom.rotation.x = -Math.PI / 2
    bottom.position.set(0, -0.5, 0)


    let leftMat = new THREE.MeshPhongMaterial({ color: 0x0000ff, side: THREE.DoubleSide });
    let left = new THREE.Mesh(geometry, leftMat);
    left.rotation.y = -Math.PI / 2
    left.position.set(-0.5, 0, 0)

    let rightMat = new THREE.MeshPhongMaterial({ color: 0xff00ff, side: THREE.DoubleSide });
    let right = new THREE.Mesh(geometry, rightMat);
    right.rotation.y = Math.PI / 2
    right.position.set(0.5, 0, 0)

    let frontMat = new THREE.MeshPhongMaterial({ color: 0xff0000, side: THREE.DoubleSide });
    let front = new THREE.Mesh(geometry, frontMat);
    front.position.set(0, 0, 0.5)

    let backMat = new THREE.MeshPhongMaterial({ color: 0x00ffff, side: THREE.DoubleSide });
    let back = new THREE.Mesh(geometry, backMat);
    back.rotation.y = Math.PI
    back.position.set(0, 0, -0.5)

    let cube = new THREE.Group();
    top.name = "top"
    bottom.name = "bottom"
    left.name = "left"
    right.name = "right"
    front.name = "front"
    back.name = "back"


    cube.add(top)
    cube.add(bottom)
    cube.add(left)
    cube.add(right)
    cube.add(front)
    cube.add(back)

    const ringGeo = new THREE.RingGeometry(0.8, 1.1, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(ringGeo, material);
    mesh.rotation.x = Math.PI / 2
    cube.add(mesh);
    
    return cube
}