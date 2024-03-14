export function SubmitedDataUsingId(ids,radioNames){ // make sure in form all input tags must have id otherwise it will give error
    let data = {}
    ids.forEach(id => {
        let value = document.getElementById(id).value
        data[id] = value
    });
    radioNames.forEach(radioName => {
       let value= document.querySelector(`input[name=${radioName}]:checked`).value;
       data[radioName] = value
    });
    return data
}
export function getSubmitFormData(formId) {
    const section = document.getElementById(formId);
    const inputs = section.getElementsByTagName("input");
    const textAreas = section.getElementsByTagName("textarea");
    const selects = section.getElementsByTagName("select");
    const tags = [inputs, textAreas, selects];
    const data = {};

    tags.forEach(elements => {
        [...elements].forEach(element => {
            let value;

            if (element.type === "checkbox") {
                value = element.checked;
            } else if (element.type === "radio") {
                if (element.checked) {
                    value = element.value;
                } else {
                    value = null; // or provide a default value
                }
            } else if (element.tagName === "SELECT") {
                if (element.multiple) {
                    // Handle multiple select elements
                    value = [...element.selectedOptions].map(option => option.value);
                } else {
                    value = element.value;
                }
            } else {
                value = element.value;
            }

            if (element.id) {
                data[element.id] = value;
            }
        });
    });

    return data;
}


// custom need function
export function getDataFromTag(section){ 
    // Make sure that every input tag in the form has the nm property; else, the function will generate an bug.
    let inputs = section.getElementsByTagName("input");
    let textAreas = section.getElementsByTagName("textarea");
    let selects = section.getElementsByTagName("select");
    let tags = [inputs,textAreas,selects]
    let data = {};
    tags.forEach(elements => {
        [...elements].forEach(element => {
            let value
            if (element.type == "checkbox"){
                value = element.checked
            }else value = element.value
            data[element.getAttribute("nm")] = value
        });    
    });
    return data
}
export function getInnerHtmlFromTag(section){ 
    // Make sure that every input tag in the form has the nm property; else, the function will generate an bug.
    let inputs = section.getElementsByTagName("input");
    let textAreas = section.getElementsByTagName("textarea");
    let selects = section.getElementsByTagName("select");
    let tags = [inputs,textAreas,selects]
    let data = {};
    tags.forEach(elements => {
        [...elements].forEach(element => {
            if (element.tagName == "SELECT") {
                const selectedOption = element.options[element.selectedIndex];
                const selectedOptionName = selectedOption.textContent;
                let html = selectedOptionName
                data[element.getAttribute("nm")] = html
            } else {
                let value = element.value
                data[element.getAttribute("nm")] = value
            }
        });   
    });
    return data
}

export function setFormData(values) {
    // values: object -> { id: value }
    for (const property in values) {
        try {
            let ele = document.getElementById(property);

            if (ele) {
                if (ele.type === 'checkbox') {
                    ele.checked = values[property] === true;
                } else if (ele.type === 'radio') {
                    if (ele.value === values[property]) {
                        ele.checked = true;
                    }
                } else if (ele.tagName === 'SELECT') {
                    if (ele.multiple) {
                        // Handle multiple select elements
                        if (Array.isArray(values[property])) {
                            for (let i = 0; i < ele.options.length; i++) {
                                ele.options[i].selected = values[property].includes(ele.options[i].value);
                            }
                        }
                    } else {
                        ele.value = values[property];
                    }
                } else {
                    ele.value = values[property];
                }
            } else {
                console.warn(`Element with id ${property} not found`);
            }
        } catch (error) {
            console.warn(`Some error while setting data at ${property}`, error);
        }
    }
}

