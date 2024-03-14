import * as THREE from 'three';
export function shapeViewer(threeViewer){
    const shapePoints = [
        [
            {
                "x": -15.006562805087619,
                "y": -1.8568410959656356,
                "z": -0.09999979198359554
            },
            {
                "x": -15.006562927121168,
                "y": -1.7945052192564068,
                "z": -0.09999979198359377
            },
            {
                "x": -15.006563441191487,
                "y": 7.063761890176057,
                "z": -0.09999979198359377
            },
            {
                "x": -14.645670926206941,
                "y": 7.063762198016059,
                "z": -0.09999979198359377
            },
            {
                "x": 11.519026897300535,
                "y": 7.063763854997697,
                "z": -0.09999979198355469
            },
            {
                "x": 11.519027532809872,
                "y": -1.85683966461482,
                "z": -0.09999979198355646
            }
        ]
      ]
    const holesPoints = [
        [
            {
                "x": 3.653212629193394,
                "y": 5.095259448438927,
                "z": -0.09999979198356712
            },
            {
                "x": 3.6532129322667153,
                "y": 2.1425036673500557,
                "z": -0.0999997919835689
            },
            {
                "x": 1.0285409969913175,
                "y": 2.1425035068359497,
                "z": -0.09999979198357067
            },
            {
                "x": 1.0285406938436772,
                "y": 5.095259221240967,
                "z": -0.09999979198357067
            }
        ],
        [
            {
                "x": -2.9084670113273816,
                "y": 5.095259013591402,
                "z": -0.099999791983576
            },
            {
                "x": -5.533138946677099,
                "y": 5.095258786393446,
                "z": -0.09999979198357956
            },
            {
                "x": -5.533138643492304,
                "y": 2.142503105330353,
                "z": -0.09999979198358133
            },
            {
                "x": -2.908466807069342,
                "y": 2.142503265954624,
                "z": -0.099999791983576
            }
        ]
      ]
      const shape = new THREE.Shape();
      shape.moveTo(shapePoints[0][0].x, shapePoints[0][0].y);
      for (let i = 0; i < shapePoints[0][0].length; i++) {
        const element = shapePoints[i]
        shape.lineTo(element.x, element.y);
      }
      shape.lineTo(shapePoints[0][0].x, shapePoints[0][0].y);
      
      
      const holes = new THREE.Path();
      holes.moveTo(holesPoints[0][0].x, holesPoints[0][0].y);
      for (let i = 0; i < holesPoints[0][0].length; i++) {
        const point = holesPoints[i]
        holes.lineTo(point.x, point.y);
      }
      holes.lineTo(holesPoints[0][0].x, holesPoints[0][0].y);
      shape.holes.push(holes);
      
      
      
      const shapeGeometry = new THREE.ShapeGeometry(shape);
      const shapeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const shapeMesh = new THREE.Mesh(shapeGeometry, shapeMaterial);
      threeViewer.scene.add(shapeMesh)
      shapeMesh.name = "rajanMesh";
      
      console.log(shapeMesh);
}