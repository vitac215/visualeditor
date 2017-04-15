/*
  Ondrag handler
  save the source object's id, tagName (IMG, DIV, etc.)
*/
function drag(event) {
  event.dataTransfer.setData('id', event.target.id);
  event.dataTransfer.setData('type', event.target.tagName);
}

/*
  Ondragover handler
*/
function dragover(event) {
  event.preventDefault();
}

/*
  Ondrop handler
  append img to container, swap img between containers
*/
function drop(event) {
  event.preventDefault();

  let target = event.target;   // can be the container or the img in the container
  let source_id = event.dataTransfer.getData('id');
  let source_img = document.getElementById(source_id);

  // check if the container already contains an img, only append img when it does not
  //    if the img is dragger over on another img, do not append
  if (target.children.length === 0 && target.tagName !== 'IMG') {
    appendImg(source_img, target);
  }

  // Swap
  let source_type = event.dataTransfer.getData('type');
  // if the source is an img and the target is also an img
  if (source_type === 'IMG' && target.tagName === 'IMG') {
    let source_container = source_img.parentElement;
    let target_img = document.getElementById(target.id);
    let target_container = target.parentElement;
    swapImg(source_container, target_container, source_img, target_img);
  }
}

/*
  Append img to a container
  @param{ele} img
  @param{ele} container
*/
function appendImg(img, container) {
  // when drops, append the img to the container
  if (img.width !== container.offsetWidth || img.height !== container.offsetHeight ) {
    // Resize the img to fit in the container
    img.width = container.offsetWidth * 0.9;
    img.height = container.offsetHeight * 0.9;
  }
  container.appendChild(img);
}

/*
  Swap img between containers
  @param{ele} sc:   source container
  @param{ele} tc:   target container
  @param{ele} simg: source img
  @param{ele} timg: target img
*/
function swapImg(sc, tc, simg, timg) {
  // remove img from original containers
  tc.removeChild(timg);
  sc.removeChild(simg);
  // append img to the other container
  appendImg(simg, tc);
  appendImg(timg, sc);
}
