const draggable = document.getElementById('draggable');
const dragButton = document.getElementById('drag-button');

let isDragging = false;
let startX, startY, initialX, initialY;

dragButton.addEventListener('mousedown', function(e) {
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
  initialX = draggable.offsetLeft;
  initialY = draggable.offsetTop;
  
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});

function onMouseMove(e) {
  if (!isDragging) return;
  
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  
  draggable.style.left = initialX + dx + 'px';
  draggable.style.top = initialY + dy + 'px';
}

function onMouseUp() {
  isDragging = false;
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
}
