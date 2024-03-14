function triggerRightClick(elementId) {
    var element = document.getElementById(elementId);
    if (!element) {
        console.error("Element with id '" + elementId + "' not found.");
        return;
    }

    // Define the right-click handler function
    function handleRightClick(event) {
        // Prevent the default right-click behavior
        event.preventDefault();
        console.log("called right Click")
        // Remove the event listener after handling the right-click
        // element.removeEventListener('contextmenu', handleRightClick);
    }

    // Add the right-click event listener
    element.addEventListener('contextmenu', handleRightClick);

    // Create a right-click event
    var rightClickEvent = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        view: window,
        button: 2, // 2 is the code for the right mouse button
        buttons: 2 // Indicates the right mouse button is pressed
    });

    // Dispatch the right-click event on the element
    element.dispatchEvent(rightClickEvent);
}

function handleRightClick(event) {
    alert('Right-click event detected!');
    // Prevent the default context menu from appearing
    event.preventDefault();
}