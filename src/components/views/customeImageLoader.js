
import * as THREE from "three";
export function customImageLoader2(threeViewer) {
    var light = new THREE.PointLight(0xFFFFFF);
    light.position.set(20, 20, 20);
    threeViewer.scene.add(light);
    var light1 = new THREE.AmbientLight(0x808080);
    light1.position.set(20, 20, 20);
    threeViewer.scene.add(light1);

    var planeGeom = new THREE.PlaneGeometry(100, 100);
    var imgSrc = "http://localhost:3001/svg/Beach_Sunglasses.svg";
    var imgSrc = "http://localhost:3001/svg/tiger.svg";
    // var imgSrc = "http://localhost:3001/svg/masking.jpeg"
    var imgSrc = "https://upload.wikimedia.org/wikipedia/commons/5/5f/BBB-Bunny.png"
    var mesh;

    var tex = new THREE.TextureLoader().load(imgSrc, (tex) => {
        tex.needsUpdate = true;

        // Calculate the aspect ratio of the image
        var aspectRatio = tex.image.width / tex.image.height;

        // Set the width and height of the plane geometry
        var planeWidth = 5;
        var planeHeight = 5 / aspectRatio;

        // Create a plane geometry with the correct aspect ratio
        var planeGeom = new THREE.PlaneGeometry(planeWidth, planeHeight);

        // Update the mesh with the new geometry
        mesh.geometry.dispose();
        mesh.geometry = planeGeom;
        mesh.scale.set(1.0, 1.0, 1.0);
        // mesh.scale.x = planeWidth / tex.image.width;
        // mesh.scale.y = planeHeight / tex.image.height;
    });

    var material = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        map: tex, transparent: true,
    });
    mesh = new THREE.Mesh(planeGeom, material);
    threeViewer.scene.add(mesh);
}

export function customImageLoader(imgSrc) {
    // var imgSrc = "http://localhost:3001/svg/tiger.svg";
    // var imgSrc = "http://localhost:3001/svg/Beach_Sunglasses.svg";
    var mesh;

    // Create a canvas element
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    // Set the size of the canvas (adjust as needed)
    canvas.width = 1024;
    canvas.height = 1024;

    // Load the image onto the canvas
    var img = new Image();
    img.crossOrigin = "Anonymous"; // Enable cross-origin resource sharing if needed
    img.src = imgSrc;
    img.onload = function () {
        context.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Create a texture from the canvas
        var tex = new THREE.CanvasTexture(canvas);
        tex.needsUpdate = true;

        // Calculate the aspect ratio of the canvas
        var aspectRatio = canvas.width / canvas.height;

        // Set the width and height of the plane geometry
        var planeWidth = 4;
        var planeHeight = planeWidth / aspectRatio;

        // Create a plane geometry with the correct aspect ratio
        var planeGeom = new THREE.PlaneGeometry(planeWidth, planeHeight);
        var material = new THREE.MeshLambertMaterial({ map: tex , transparent: true, doubleSide: THREE.doubleSide });

        // Create a mesh with the plane geometry and material
        mesh = new THREE.Mesh(planeGeom, material);
        return mesh
    };
}