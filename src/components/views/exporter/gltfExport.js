import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

export function exportGLTF(obj) {
    var options = {
        binary: true // Export as binary (GLB) format
    };
    const exporter = new GLTFExporter();
    exporter.parse(obj.getObjectByName("cube1"), function (result) {
        // 'result' is a GLTF file represented as an ArrayBuffer
        // You can save it to a file or send it over the network
        if ( result instanceof ArrayBuffer ) {

            saveArrayBuffer( result, 'scene.glb' );

        } else {

            const output = JSON.stringify( result, null, 2 );
            console.log( output );
            saveString( output, 'scene.gltf' );

        }
    }, options);

    function saveArrayBuffer(buffer, filename) {

        save( new Blob([buffer], { type: 'application/octet-stream' }), filename );
        
    }

    function saveString( text, filename ) {

        save( new Blob( [ text ], { type: 'text/plain' } ), filename );

    }

    function save( blob, filename ) {
        const link = document.createElement( 'a' );
        link.style.display = 'none';
        document.body.appendChild( link ); // Firefox workaround, see #6594
        link.href = URL.createObjectURL( blob );
        link.download = filename;
        link.click();

        // URL.revokeObjectURL( url ); breaks Firefox...

    }

}