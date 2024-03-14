const createSnapPoints = (section, inElement, lPoint)=> {
    
    let xSnap = null
    let ySnap = null
    let xOffset = 0
    let yOffset = 0
    
    const adjustPos = (val) =>{
        return val / 1000
        //return Number(val).toFixed(3)
        //const returnVal = Math.round((Number(val) * 10000)) / 10000
        
        //return returnVal
    }

    
    
    let sectionSize = section.userData.size
    let elementSize = inElement.userData.size
    
    const sectionTop = (section.userData.point.y - (sectionSize.y/2))
    const sectionBottom = (section.userData.point.y + (sectionSize.y/2))
    
    
    const sectionCenterY = 0//section.userData.point.y
    const sectionCenterX = 0//section.userData.point.x
    
    
    
    
    // element X points
    const elementCenterX =  lPoint.x
    const elementRight =  elementCenterX - (elementSize.x/2)
    const elementLeft =  elementCenterX + (elementSize.x/2)
    
    // element Y points
    const elementCenterY =  lPoint.y
    const elementTop =  elementCenterY + (elementSize.y/2)
    const elementBottom =  elementCenterY - (elementSize.y/2)
    
    const stickersList = section.children.filter(el=> el.customType === "sticker" && el.id !== inElement.id)
    
    
    let SnappingPointsX = [
        sectionCenterX,
        sectionCenterX - (sectionSize.x/2),
        sectionCenterX + (sectionSize.x/2)
    ]
    let SnappingPointsY = [
        sectionCenterY,
        sectionCenterY - (sectionSize.y/2),
        sectionCenterY + (sectionSize.y/2)
    ]
    
    
    stickersList.forEach(el=> {
        const xCenter = el.userData.point.x - section.userData.point.x
        const yCenter = el.userData.point.y - section.userData.point.y
        
        const width = el.userData.size.x
        const height = el.userData.size.y
        
        const xLeft = (xCenter - (width/2))
        const xRight = (xCenter + (width/2))
        
        const yTop = (yCenter - (height/2))
        const yBottom = (yCenter + (height/2))
        
        
        SnappingPointsX = [...new Set([...SnappingPointsX, xRight, xLeft, xCenter])];
        SnappingPointsY = [...new Set([...SnappingPointsY, yTop, yBottom, yCenter])];
        
    })
    const dif = 0.002
    const between = (v1, v2) => {
        return Math.abs(v1 - v2) < dif
    }
    SnappingPointsX.forEach(el=> {
        
        const x = el
        
        if (between(elementRight , x)) {
            xSnap = el
            xOffset = (elementSize.x / 2)
        }
        if (between(elementLeft, x)) {
            xSnap = el
            xOffset = 0 - (elementSize.x / 2)
        }
        if (between(elementCenterX, x)) {
            xSnap = x
            xOffset = 0
        }
        
    })
 
    SnappingPointsY.forEach(el=> {
        const y = el
        if (between(elementBottom,y)) {
            ySnap = el
            yOffset = (elementSize.y / 2)
        }
        if (between(elementTop,y)) {
            ySnap = el
            yOffset = 0 - (elementSize.y / 2)
        }
        if (between(elementCenterY,y)) {
            ySnap = el
            yOffset = 0
        }
    })
    
    return {
        x: xSnap !== null ? Number(xSnap) : null,
        y: ySnap !== null ? Number(ySnap) : null,
        xOffset: xOffset,
        yOffset: yOffset
    }
}

export default createSnapPoints