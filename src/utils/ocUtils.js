import * as THREE from 'three'
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { DCCurve } from '../threeCustom/DCEdge';

export function getFacesFromShape(oc, shape) {
    /**
     * This function returns the faces of a shape
     * @param {OpenCascade} oc
     * @param {TopoDS_Shape} shape
     * @returns {Array<TopoDS_Face>}
     */
    let faces = []
    const ExpFace = new oc.TopExp_Explorer_1();
    let toFind = oc.TopAbs_ShapeEnum.TopAbs_FACE
    let toAvoid = oc.TopAbs_ShapeEnum.TopAbs_SHAPE

    for (ExpFace.Init(shape, toFind, toAvoid); ExpFace.More(); ExpFace.Next()) {
        const TopoDS_Shape = ExpFace.Current();
        const myFace = oc.TopoDS.Face_1(TopoDS_Shape);
        faces.push(myFace)
        // TODO: Check if this is necessary
        TopoDS_Shape.delete()
    }
    ExpFace.delete()
    return faces
}
export function getEdgesFromFace(oc, inOCFace) {
    /**
     * This function returns the edges of a face
     * @param {OpenCascade} oc
     * @param {TopoDS_Face} inOCFace
     * @returns {Array<TopoDS_Edge>}
     */
    
    let edges = []
    let toFind = oc.TopAbs_ShapeEnum.TopAbs_EDGE
    let toAvoid = oc.TopAbs_ShapeEnum.TopAbs_SHAPE

    const ExpEdge = new oc.TopExp_Explorer_1();
    for (ExpEdge.Init(inOCFace, toFind, toAvoid); ExpEdge.More(); ExpEdge.Next()) {
        const myShapeEdge = ExpEdge.Current();
        const myEdge = oc.TopoDS.Edge_1(myShapeEdge);
        edges.push(myEdge)
        myShapeEdge.delete()
    }
    return edges
}

export function getEdgesFromFaces(oc, shape, index) {
    let edges = []
    let faces = []

    let toFind = oc.TopAbs_ShapeEnum.TopAbs_FACE
    let toAvoid = oc.TopAbs_ShapeEnum.TopAbs_SHAPE

    const ExpFace = new oc.TopExp_Explorer_1();

    for (ExpFace.Init(shape, toFind, toAvoid); ExpFace.More(); ExpFace.Next()) {
        const TopoDS_Shape = ExpFace.Current();
        const myFace = oc.TopoDS.Face_1(TopoDS_Shape);
        faces.push(myFace)
    }

    const ExpEdge = new oc.TopExp_Explorer_1();
    for (ExpEdge.Init(faces[index], oc.TopAbs_ShapeEnum.TopAbs_EDGE, oc.TopAbs_ShapeEnum.TopAbs_SHAPE); ExpEdge.More(); ExpEdge.Next()) {
        const myShapeEdge = ExpEdge.Current();
        const myEdge = oc.TopoDS.Edge_1(myShapeEdge);
        edges.push(myEdge)
    }
    return edges
}
export function getPointsFromEdge(openCascade, inEdge) {
    let points = []
    const ExpVertex = new openCascade.TopExp_Explorer_1();

    for (ExpVertex.Init(inEdge, openCascade.TopAbs_ShapeEnum.TopAbs_VERTEX, openCascade.TopAbs_ShapeEnum.TopAbs_SHAPE); ExpVertex.More(); ExpVertex.Next()) {
        const myShapeVertex = ExpVertex.Current();
        const myVertex = openCascade.TopoDS.Vertex_1(myShapeVertex);
        const point = openCascade.BRep_Tool.Pnt(myVertex)
        points.push(new THREE.Vector3(point.X(), point.Y(), point.Z()));
    }
    return points
}
export function getPointsFromEdge2(openCascade, inEdge,shape) {
    let points = []
    const ExpVertex = new openCascade.TopExp_Explorer_1();
    const myFace = openCascade.TopoDS.Face_1(shape);
    for (ExpVertex.Init(myFace , openCascade.TopAbs_ShapeEnum.TopAbs_EDGE, openCascade.TopAbs_ShapeEnum.TopAbs_SHAPE); ExpVertex.More(); ExpVertex.Next()) 
    {
        const myShapeEdge = ExpEdge.Current();
        const myEdge = openCascade.TopoDS.Edge_1(myShapeEdge);
        let adpCurve = new openCascade.BRepAdaptor_Curve_2(myEdge)
      if(adpCurve.GetType() == openCascade.GeomAbs_CurveType.GeomAbs_Circle || adpCurve.GetType() == openCascade.GeomAbs_CurveType.GeomAbs_BSplineCurve )
      {
        let t1 = adpCurve.FirstParameter();
        let t2 = adpCurve.LastParameter();
        let dt = (t2-t1)/80.0
        //openCascade.BRep_Tool.Range_1(myEdge,t1,t2)
        let hGeomCurve = openCascade.BRep_Tool.Curve_2(myEdge,t1,t2)
        for (let t = t1; t <= t2; t+=dt) {
          let point = hGeomCurve.get().Value(t);
          points.push( new THREE.Vector3( point.X(), point.Y(),point.Z() ) );
        }        
        let point = hGeomCurve.get().Value(t2);
        points.push( new THREE.Vector3( point.X(), point.Y(),point.Z() ) );
      }else{
          for (ExpVertex.Init(inEdge, openCascade.TopAbs_ShapeEnum.TopAbs_VERTEX, openCascade.TopAbs_ShapeEnum.TopAbs_SHAPE); ExpVertex.More(); ExpVertex.Next()) {
              const myShapeVertex = ExpVertex.Current();
              const myVertex = openCascade.TopoDS.Vertex_1(myShapeVertex);
              const point = openCascade.BRep_Tool.Pnt(myVertex)
              points.push(new THREE.Vector3(point.X(), point.Y(), point.Z()));
          }
      }
    }
    return points
}
export function getOuterWire(oc, inFaces) {
    let edges = []
    // To get the outer wire of the given face
    let outerWire = oc.BRepTools.OuterWire(inFaces)
    // Get the Edges of the Outerwire
    const ExpEdge = new oc.TopExp_Explorer_1();

    let toFind = oc.TopAbs_ShapeEnum.TopAbs_EDGE
    let toAvoid = oc.TopAbs_ShapeEnum.TopAbs_SHAPE

    for (ExpEdge.Init(outerWire, toFind, toAvoid); ExpEdge.More(); ExpEdge.Next()) {
        const myShapeEdge = ExpEdge.Current();
        const myEdge = oc.TopoDS.Edge_1(myShapeEdge);
        edges.push(myEdge)
        myShapeEdge.delete()
    }
    return edges
}

export function  replaceOpenCascadeShape(inShapeTool, oldOpenCascadeShape, newOpenCascadeShape, openCascade) {
    let reShapeTool = new openCascade.BRepTools_ReShape()
    
    reShapeTool.Remove(oldOpenCascadeShape)
    reShapeTool.Replace(oldOpenCascadeShape, newOpenCascadeShape)

    let newShape = reShapeTool.Apply(newOpenCascadeShape, openCascade.TopAbs_ShapeEnum.TopAbs_SHAPE)
    let assembly  = getAssembly(inShapeTool, openCascade)
    if (!openCascade.XCAFDoc_ShapeTool.IsAssembly(assembly)) {
        let label  = inShapeTool.FindShape_2(oldOpenCascadeShape, false);
        inShapeTool.SetShape(label, newShape)
    }
    if (openCascade.XCAFDoc_ShapeTool.IsAssembly(assembly)) {
        let label  = inShapeTool.FindShape_2(oldOpenCascadeShape, true);
        inShapeTool.RemoveShape(label, true)
        inShapeTool.SetShape(label, newShape)
        inShapeTool.UpdateAssemblies()
    }
    
}
function getAssembly(inShapeTool, openCascade) {
    const assemblyLabelSequence = new openCascade.TDF_LabelSequence_1();
    inShapeTool.GetFreeShapes(assemblyLabelSequence);
    return assemblyLabelSequence.Value(1);
}
export const exportStepDoc = (openCascade, inDoc) => {
    var writer = new openCascade.STEPCAFControl_Writer_1()
    openCascade.Interface_Static.SetIVal("write.precision.mode", 1);
    openCascade.Interface_Static.SetIVal("write.precision.val", 0.1);
    openCascade.Interface_Static.SetIVal("write.step.assembly", 1);
    openCascade.Interface_Static.SetIVal("write.step.schema", 4);
    openCascade.Interface_Static.SetIVal("write.step.vertex.mode", 0);
    openCascade.Interface_Static.SetIVal("write.surfacecurve.mode", 1);
    openCascade.Interface_Static.SetIVal("write.stepcaf.subshapes.name", 1);
    writer.SetColorMode(true)
    writer.SetNameMode(true)
    let handleDoc = new openCascade.Handle_TDocStd_Document_2(inDoc);
    writer.Perform_2(handleDoc, 'file.step', new openCascade.Message_ProgressRange_1())
    let writeResult = writer.Write('file.step')
    if (writeResult === openCascade.IFSelect_ReturnStatus.IFSelect_RetDone) {
        // Read the STEP file from the virtual file system
        const stepFile = openCascade.FS.readFile("./file.step", { encoding: "binary" });

        openCascade.FS.unlink(`./file.step`);
        // Create a new blob with the step file data
        const stepBlob = new Blob([stepFile.buffer], { type: "application/step" });
        return stepBlob
    }
}