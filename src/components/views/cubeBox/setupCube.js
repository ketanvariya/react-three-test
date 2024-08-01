import { NavigationCube3D } from "./navigationCube3D"

export function navigationCubeSetup(inViewer) {

    let navigationCube = new NavigationCube3D(document.getElementById('navigationCube3D'))
    navigationCube.updateCube(inViewer.camera)
    document.addEventListener("viewChange", (e) => {

        let view = e.detail.eventName
        console.log(view)
        switch (view) {

            case "top":
                console.log("in tosspaaa")
                // inViewer.setTopView()

                break;
            case "left":
                console.log("in leftaaa")
                // inViewer.setLeftView()
                break;
            case "right":
                console.log("in rightaaa")
                // inViewer.setRightView()
                break;
            case "front":
                // inViewer.setFrontView()
                console.log("in frontaaa")
                
                break;
            case "rear":
                inViewer.setBackView();
                break;
            default:
                break;
        }
        navigationCube.updateCube(inViewer.camera)
    })

    function render() {
        navigationCube.updateCube(inViewer.camera)
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    animate()

    return navigationCube
}