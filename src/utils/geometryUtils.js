
// Get bounding box from geometry
export function getBoundingBox(geometry) {
    geometry.computeBoundingBox()
    let boundingBox = geometry.boundingBox
    return boundingBox.clone()
}
// Generate 2d circle points
export function generate2DCirclePoints(inCenter, inRadius, inSegments) {
    let points = []
    let segments = inSegments || 30
    for (let i = 0; i < segments; i++) {
        let theta = (i / segments) * Math.PI * 2
        let x = inCenter.x + inRadius * Math.cos(theta)
        let y = inCenter.y + inRadius * Math.sin(theta)
        points.push(new THREE.Vector2(x, y))
    }
    return points
   
}

// Generate 2d circle corner points
export function generate2DCircleCornerPoints(inCenter, inRadius) {
    let cornerPoints = []
    cornerPoints.push(new THREE.Vector2(inCenter.x + inRadius, inCenter.y))
    cornerPoints.push(new THREE.Vector2(inCenter.x - inRadius, inCenter.y))
    cornerPoints.push(new THREE.Vector2(inCenter.x, inCenter.y + inRadius))
    cornerPoints.push(new THREE.Vector2(inCenter.x, inCenter.y - inRadius))
    return cornerPoints
}

// Generate 2d ellipse points
export function generate2DEllipsePoints(inCenter, inRadiusX, inRadiusY, inSegments) {
    let points = []
    let segments = inSegments || 30
    for (let i = 0; i < segments; i++) {
        let theta = (i / segments) * Math.PI * 2
        let x = inCenter.x + inRadiusX * Math.cos(theta)
        let y = inCenter.y + inRadiusY * Math.sin(theta)
        points.push(new THREE.Vector2(x, y))
    }
    return points
}

// Generate corner points of ellipse
export function generate2DEllipseCornerPoints(inCenter, inRadiusX, inRadiusY) {
    
    let cornerPoints = []
    cornerPoints.push(new THREE.Vector2(inCenter.x + inRadiusX, inCenter.y))
    cornerPoints.push(new THREE.Vector2(inCenter.x - inRadiusX, inCenter.y))    
    cornerPoints.push(new THREE.Vector2(inCenter.x, inCenter.y + inRadiusY))
    cornerPoints.push(new THREE.Vector2(inCenter.x, inCenter.y - inRadiusY))
    return cornerPoints
}

// Generate 2d arc points
export function generate2DArcPoints(inCenter, inRadius, inStartAngle, inEndAngle, inSegments) {
    let points = []
    let segments = inSegments || 30
    let startAngle = inStartAngle || 0
    let endAngle = inEndAngle || Math.PI * 2
    for (let i = 0; i < segments; i++) {
        let theta = startAngle + (i / segments) * (endAngle - startAngle)
        let x = inCenter.x + inRadius * Math.cos(theta)
        let y = inCenter.y + inRadius * Math.sin(theta)
        points.push(new THREE.Vector2(x, y))
    }
    return points
}
