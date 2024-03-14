import Shape from '@doodle3d/clipper-js/src';
import ClipperLib from '@doodle3d/clipper-lib/clipper';


export function clipperInit2(){
    const subjectPaths = [[{ X: 0, Y: 0 }, { X: 10, Y: 0 }, { X: 10, Y: 10 },{ X: 0, Y: 10 }]];
    const clipPaths = [[{ X: -2, Y: 2 }, { X: 20, Y: 2 }, { X: 20, Y:5 },{ X: -2, Y:5 }]];
    const result = new ClipperLib.Paths();
    const clipper = new ClipperLib.Clipper();
    clipper.AddPaths(subjectPaths, ClipperLib.PolyType.ptSubject, true);
    clipper.AddPaths(clipPaths, ClipperLib.PolyType.ptClip, true);
    clipper.Execute(ClipperLib.ClipType.ctIntersection, result);
    
    console.log(result,"result")
    console.log(clipper,"clipper")

    // clipperInit2()
    
}
export function clipperInit(){
    const subjectPaths = [[{ X: 0, Y: 0 }, { X: 10, Y: 0 }, { X: 10, Y: 10 },{ X: 0, Y: 10 }]];
    const clipPaths = [[{ X: -2, Y: 2 }, { X: 20, Y: 2 }, { X: 20, Y:5 },{ X: -2, Y:5 }]];

    const subject = new Shape(subjectPaths, true);
    const clip = new Shape(clipPaths, true);
    
    const result = subject.intersect(clip);
    
    console.log(result,"result2")
    // console.log(clipper,"clipper")
    
    // result = [[{ X: 20, Y: 20 }, { X: 10, Y: 20 }, { X: 10, Y: 10 }, { X: 20, Y: 10 }]]
}