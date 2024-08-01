import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { addLights } from "./lightSetup";

export async function initModelViewer(params) {
    let threeViewer = params.threeViewer
//   let threeViewer = new ThreeViewer({
//     element: document.getElementById("modelViewer"),
//     isAddLights: false,
//   });
//   threeViewer.initViewer();

  await addLights(threeViewer.scene, threeViewer.camera, threeViewer)
  let isLive = false
  let modelUrl;
modelUrl = "https://hexacoder.s3.ap-south-1.amazonaws.com/projects/nae/assets/three/glb/customize.glb";

  if (!modelUrl) {
    alert("Model not found");
    return;
  }

  // Instantiate GLTFLoader
  const loader = new GLTFLoader();

  // Load a GLTF model
  loader.load(
    // URL of the model
    modelUrl,
    // onLoad callback
    function (gltf) {
        let model = gltf.scene;
      threeViewer.scene.add(gltf.scene);

    //   threeViewer.controls.fitToBox(gltf.scene, true, {
    //     paddingTop: 1,
    //     paddingRight: 1,
    //     paddingBottom: 1,
    //     paddingLeft: 1,
    //   });

    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
      console.error("An error happened", error);
    }
  );
}
