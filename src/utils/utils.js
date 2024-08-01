export function openHtmlModal(modelId) {
    /**
     * This function display the HTML model
     * @param {String} modelId
     * @returns {Null} 
    */     

   
   var myModal = new bootstrap.Modal(document.getElementById(modelId), {});
   myModal.show();

   // close fade null div if any other model open
   let fadeEles = document.getElementsByClassName("modal-backdrop")
   Array.from(fadeEles).forEach((ele)=>{
       if (ele.innerHTML === ""){
           ele.remove()
       }
   })
   
}
export function closeHtmlModal(modelId) {
    /**
     * This function close the HTML model
     * @param {String} modelId
     * @returns {Null} 
    */  

    var myModalEle = document.getElementById(modelId)
    let closeBtns = myModalEle.getElementsByClassName("btn-close")
    if (closeBtns.length > 0){
        closeBtns[0].click();
    }

}

export function customAlert(message){
    if (!message) console.warn("message is not defined")
    document.getElementById("alertMessage").innerHTML = message
    openHtmlModal("customAlertModal")
}
export function customAlertWithCancel(message,callBackFunction){
    if (!message) console.warn("message is not defined")
    document.getElementById("alertMessage2").innerHTML = message

    openHtmlModal("customAlertModalWithCancel")
}
export function customAlertModalWithCancelForError(message, callBackFunction) {
    if (!message) console.warn("message is not defined")
    document.getElementById("alertMessage3").innerHTML = message
    document.getElementById("errorForm").addEventListener("click", callBackFunction)
    openHtmlModal("customAlertModalWithCancelForError")
}

export function getExtension(fileName){
    let name = fileName.replace(/\.[^/.]+$/, "")
    let extension = fileName.substring(fileName.lastIndexOf('.')+1, fileName.length) || fileName;
    return {
        name,
        extension,
    }
}

export function getRawDataFromFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function (event) {
            try {
                const dataURL = event.target.result;
                resolve(dataURL);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = function (error) {
            reject(error);
        };

        reader.readAsDataURL(file);
    });
}

export function removeClassNameUsingClass(className,addClassName){
    let eles = document.getElementsByClassName(className)
    Array.from(eles).forEach(ele=>{
        ele.classList.remove(addClassName)
    })
}
export function addClassNameUsingClass(className,addClassName){
    let eles = document.getElementsByClassName(className)
    Array.from(eles).forEach(ele=>{
        ele.classList.add(addClassName)
    })
}

export function readBlob(blob) {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.onloadend = function () {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsText(blob);
    });
  }

export function addRefSphere(inPosition = new THREE.Vector3(0, 0, 0), size) {
    const geometry = new THREE.SphereGeometry(size, 32, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.name = 'refSphere';
    sphere.position.x = inPosition.x;
    sphere.position.y = inPosition.y;
    sphere.position.z = inPosition.z;
    return sphere;
}

