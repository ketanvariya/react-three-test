import { createThreeLine } from "./customUtils"
import { createLine } from "./customUtils"
import * as THREE from 'three'
import { createFatLines } from "./customUtils2";
import { customCircle, customEllipseBody, customRectangle, ellipseBody } from "../openCascadeShapes";

export const EntityTypeEnum = {
    NONE: "NONE",
    LINE: "LINE",
    CIRCLE: "CIRCLE",
    ELLIPSE: "ELLIPSE"
}
export class Entity2DDrive {
    constructor(inGeomCurve, inT1, inT2, hGeomCurve) {
        this.mGeom2DCurve = inGeomCurve;
        this.hGeomCurve = hGeomCurve;
        this.mT1 = inT1;
        this.mT2 = inT2;
        this.mSplitParam = [];
        this.trimmedCurve = []
        this.threePointsArray = []
        this.mesh = []
        this.endPoints = []
        this.entityType = EntityTypeEnum.NONE
        this.generateEntityType()
        this.generateLineEndPoints()
    }
    generateEntityType() {
        if (this.mGeom2DCurve.get() instanceof ocGlobal.Geom2d_Circle) {
            this.entityType = EntityTypeEnum.CIRCLE
        } else if (this.mGeom2DCurve.get() instanceof ocGlobal.Geom2d_Line) {
            this.entityType = EntityTypeEnum.LINE
        }
        this.refPoints = []
        this.generateRefCircle()

    }
    generateRefCircle() {
        this.refCircleGeo = new THREE.CircleGeometry(1, 16);
        this.refCircleMat = new THREE.MeshBasicMaterial({
            color: 0xffff00, side: THREE.FrontSide,
            polygonOffset: true,
            polygonOffsetFactor: 0.1,
            polygonOffsetUnits: -200
        });
        this.refCircle = new THREE.Mesh(this.refCircleGeo, this.refCircleMat);
        this.refCircle.name = "refCircle"
        // this.refCircle.visible = false
    }
    addRefPoint(inPoint,parent) {
        let refCircle = this.refCircle.clone()
        refCircle.position.copy(inPoint)
        refCircle.layers.set(4)
        parent.add(refCircle)
        this.refPoints.push(refCircle)
    }
    splitEntities(oc) {
        let scope = this
        scope.trimmedCurve = []

        let splitParam = scope.mSplitParam

        splitParam.sort((a, b) => a - b);

        // Split entity according to its type and update trimmedCurve
        if (scope.mGeom2DCurve.get() instanceof oc.Geom2d_Circle) {
            scope.splitCircle(oc)
        } else if (scope.mGeom2DCurve.get() instanceof oc.Geom2d_Line) {
            scope.splitLine(oc)
        }
    }
    getLineEndPoints() {
        return this.endPoints
    }
    generateLineEndPoints() {
        if(this.entityType === EntityTypeEnum.LINE) {
            let scope = this
            let startPoint = this.mGeom2DCurve.get().Value(this.mT1)
            let endPoint = this.mGeom2DCurve.get().Value(this.mT2)
            scope.endPoints.push(new THREE.Vector3(startPoint.X(), startPoint.Y(), 0))
            scope.endPoints.push(new THREE.Vector3(endPoint.X(), endPoint.Y(), 0))
        }
    }
    getPointOnLine(inT) {
        let point = this.mGeom2DCurve.get().Value(inT)
        return new THREE.Vector3(point.X(), point.Y(), 0)
    }

    splitLine(oc) {
        let scope = this
        let firstParam = this.mT1;
        // Check flag
        let splitParam = scope.mSplitParam
        if (splitParam.length === 1 ) {
            splitParam.unshift(scope.mT1)
            splitParam.push(scope.mT2)
        }

        // if there is no Split Parameters 
        if (splitParam.length === 0 ) {
            splitParam.unshift(scope.mT1)
            splitParam.push(scope.mT2)
        }
        // Check flag

        for (let i = 1; i < splitParam.length; i++) {
            let secondParam = splitParam[i];
            let curve3d = oc.GeomAPI.To3d(scope.mGeom2DCurve, new oc.gp_Pln_3(new oc.gp_Pnt_3(window.tempCenter.x,window.tempCenter.y,window.tempCenter.z),new oc.gp_Dir_4(window.tempNormal.x, window.tempNormal.y, window.tempNormal.z)))
            let trimmedLine3D = new oc.Geom_TrimmedCurve(curve3d, firstParam, secondParam, true, true)
            let trimmedLine1  = new oc.Geom2d_TrimmedCurve(scope.mGeom2DCurve, firstParam, secondParam, true, true)
            let hGeom2dCurve = trimmedLine1.BasisCurve()
            let startPoint = hGeom2dCurve.get().Value(firstParam)
            let endPoint = hGeom2dCurve.get().Value(secondParam)
            let startX = startPoint.X()
            let startY = startPoint.Y()
            let endX = endPoint.X()
            let endY = endPoint.Y()
            let pnt1 = (new THREE.Vector3(startX, startY ))
            let pnt2 = (new THREE.Vector3(endX, endY))
            // let mesh = createThreeLine(pnt1, pnt2)
            let mesh = createFatLines([pnt1, pnt2],.003)
            this.addRefPoint(pnt1,mesh)
            this.addRefPoint(pnt2,mesh)

            scope.mesh.push(mesh)

            scope.trimmedCurve.push(trimmedLine3D)
            firstParam = secondParam
        }
    }
    logMesh()
    {
        let startPoint = this.mGeom2DCurve.get().Value(this.mT1)
        let endPoint = this.mGeom2DCurve.get().Value(this.mT2)
        console.log(startPoint.X(),startPoint.Y())
        console.log(endPoint.X(),endPoint.Y())
    }
    splitCircle(oc) {
        let scope = this

        let splitParam = scope.mSplitParam
        
        // Circle Parameters
        let segmentedPoints = []

        function createCurve(inFirstParams, inSecondParams, hGeom2DCurve) {
            let threePoints = []

            let curveParamStep = (inSecondParams - inFirstParams) / 80.0;

            for (let t = inFirstParams; t <= inSecondParams; t += curveParamStep) {
                const point = hGeom2DCurve.get().Value(t);
                threePoints.push(new THREE.Vector3(point.X(), point.Y(), 0));
            }

            let pointEnd = hGeom2DCurve.get().Value(inSecondParams);
            threePoints.push(new THREE.Vector3(pointEnd.X(), pointEnd.Y(), 0));
            segmentedPoints.push(threePoints)
            let mesh = createFatLines(threePoints,.003)
            scope.addRefPoint(threePoints[0],mesh)                      // Start point
            scope.addRefPoint(threePoints[41],mesh)                     // Middle Point, TODO : Improvement needed : Get from OpenCascade
            scope.addRefPoint(threePoints[threePoints.length-1],mesh)   // End point
            scope.mesh.push(mesh)
        }

        let isFullCircle = check2ValuesAreEqualInTol(0,scope.mT1,.01) && check2ValuesAreEqualInTol(Math.PI*2,scope.mT2,.001)
        if(isFullCircle) {
            // Full Circle
            if(splitParam.length == 1) {
                createCurve(scope.mT1, scope.mT2)
                return
            }
            splitParam.push(splitParam[0] + Math.PI * 2)

        }else {
            // Arc

            splitParam.unshift(scope.mT1)
            splitParam.push(scope.mT2)
        }

        for (let i = 0; i < splitParam.length - 1; i++) {
            var firstParam = splitParam[i]
            var secondParam = splitParam[(i + 1)];
            let trimmedLine1 = new oc.Geom2d_TrimmedCurve(scope.mGeom2DCurve, firstParam, secondParam, true, true)
            let curve3d = oc.GeomAPI.To3d(scope.mGeom2DCurve, new oc.gp_Pln_3(new oc.gp_Pnt_3(window.tempCenter.x,window.tempCenter.y,window.tempCenter.z),new oc.gp_Dir_4(window.tempNormal.x, window.tempNormal.y, window.tempNormal.z)))
            let trimmedLine3D = new oc.Geom_TrimmedCurve(curve3d, firstParam, secondParam, true, true)
            scope.trimmedCurve.push(trimmedLine3D)

            let hGeom2dCurve = trimmedLine1.BasisCurve()

            createCurve(firstParam,secondParam, hGeom2dCurve )
        }
    }
}
export function getEntity2DDrive(openCascade,DCEntity,normal){
    let threeFaceData = DCEntity.getThreeFaceData()
    switch (DCEntity.entityType) {
        case "Rect":
            let entity2dRectangle = customRectangle(openCascade, threeFaceData.points)
            return entity2dRectangle
            break;
        case "Circle":
            let circleCenter = threeFaceData.center
            let radius = DCEntity.radius
            return customCircle(openCascade,circleCenter, normal, radius)
            break;
        case "Polyline":
            let entity2dPolyLine = customRectangle(openCascade, threeFaceData.points)
            return entity2dPolyLine
            break;
        case "Ellipse":
            let ellipseCenter = DCEntity.centerPoint
            let xRadius = DCEntity.xRadius
            let yRadius = DCEntity.yRadius
            let entity2dEllipse = customEllipseBody(openCascade, ellipseCenter, xRadius, yRadius, normal, DCEntity.rotation.z)
            return entity2dEllipse
            break;
        default:
            break;
    }
}
function check2ValuesAreEqualInTol(inValue1, inValue2, inTol) {
    if (Math.abs(inValue1 - inValue2) < inTol) {
        return true;
    }
    return false;
}