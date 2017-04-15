/*
  Ondrag handler
  Save the source object's id
*/
function drag(event) {
  event.dataTransfer.setData("id", event.target.id);
}

/*
  Ondragover handler
*/
function dragover(event) {
  event.preventDefault();
}

/*
  Ondrop handler
*/
function drop(event) {
  event.preventDefault();

  // get the container, get source id and source img
  let container = event.target;
  let source_id = event.dataTransfer.getData("id");
  let source_img = document.getElementById(source_id);

  // when drops, append the img to the container
  if (source_img.width !== container.offsetWidth || source_img.height !== container.offsetHeight ) {
    source_img.width = container.offsetWidth * 0.9;
    source_img.height = container.offsetHeight * 0.9;
  }
  container.appendChild(source_img);
}
