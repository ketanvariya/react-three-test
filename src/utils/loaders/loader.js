export async function showLoader() {
    const loaderContainer = document.createElement('div');
    loaderContainer.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';
    document.body.appendChild(loaderContainer.firstChild);
    await sleep(0)

}

export function removeLoader() {
    const loaderContainer = document.querySelector('.loader-container');
    if (loaderContainer) {
        document.body.removeChild(loaderContainer);
    }
}

function sleep(inMs) {
    return new Promise(resolve => setTimeout(resolve, inMs));
}

// ADD THIS CSS IN .css FILE

/* loader.css */
// .loader - container {
//     position: fixed;
//     top: 0;
//     left: 0;
//     width: 100 %;
//     height: 100 %;
//     background - color: rgba(0, 0, 0, 0.7);
//     display: flex;
//     align - items: center;
//     justify - content: center;
//     z - index: 9999;
// }

// .loader {
//     border: 4px solid #f3f3f3;
//     border - top: 4px solid #3498db;
//     border - radius: 50 %;
//     width: 40px;
//     height: 40px;
//     animation: spin 2s linear infinite;
// }

// @keyframes spin {
//     0 % { transform: rotate(0deg); }
//     100 % { transform: rotate(360deg); }
// }