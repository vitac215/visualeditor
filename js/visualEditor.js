/*
  Event listener for clicking an img container
  highlight a clicked img container
*/
document.addEventListener('click', (e) => {
  var ele = e.target;
  // if the clicked element is a imgcontainer or
  //   the clicked element is a img and it's in a container
  if (ele.tagName === 'DIV' && ele.classList.contains('imgcontainer')) {
    highlight(ele);
  } else if (ele.tagName === "IMG" && inContainer(ele)) {
    highlight(ele.parentElement);
  }
})

/*
  Event listener for clicking the 'add' button
  append a new contaienr to the layout area
*/
document.getElementById('js-btn-add').addEventListener('click', () => {
  var newContainer = createNewContainer();
  document.getElementsByClassName('section-layout')[0].append(newContainer);
})

/*
  Event listener for clicking the 'split horizontally' button
  split the clicked container horizontally
*/
document.getElementById('js-btn-split-h').addEventListener('click', () => {
  // get the clicked container
  var oldContainer = document.getElementById('imgcontainer-clicked');

  // Make sure the container after split is not too small (should be larger than 60)
  if (oldContainer && oldContainer.offsetHeight/2 >= 60) {
    split('h', oldContainer);
  }
})

/*
  Event listener for clicking the 'split vertically' button
  split the clicked container vertically
*/
document.getElementById('js-btn-split-v').addEventListener('click', () => {
  // get the clicked container
  var oldContainer = document.getElementById('imgcontainer-clicked');

  // Make sure the container after split is not too small (should be larger than 60)
  if (oldContainer && oldContainer.offsetWidth/2 >= 60) {
    split('v', oldContainer);
  }
})



/*
  Ondrag handler
  save the source object's id, tagName (IMG, DIV, etc.)
*/
function drag(event) {
  event.dataTransfer.setData('id', event.target.id);
  // event.dataTransfer.setData('type', event.target.tagName);
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
    highlight(target);
  }

  // Swap
  let source_type = event.dataTransfer.getData('type');
  // if the source and target are both img
  if (target.tagName === 'IMG') {
    // get the target img
    let target_img = document.getElementById(target.id);
    // if the source img and target img are both in a container
    if (inContainer(source_img) && inContainer(target_img)) {
      // get the source and target container
      let source_container = source_img.parentElement;
      let target_container = target.parentElement;
      swapImg(source_container, target_container, source_img, target_img);
      highlight(target_container);
    }
  }
}

// && target.tagName === 'IMG' && target.parentElement.classList.contains('imgcontainer')

/*
  Append img to a container
  @param{ele} img
  @param{ele} container
*/
function appendImg(img, container) {
  // Resize the img to fit in the container
  updateImgSize(img, container)
  // when drops, append the img to the container
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

/*
  Highlight a clicked img container
*/
function highlight(container) {
  var containers = document.getElementsByClassName('imgcontainer');
  // remove highlighting on all containers
  Array.from(containers).forEach((ele) => {
    ele.removeAttribute('id');
  });
  // highlight the clicked container
  container.setAttribute('id', 'imgcontainer-clicked');
}

/*
  Create a new container element
  @return{ele} container: the newly created container element
*/
function createNewContainer() {
  var container = document.createElement('div');
  // Set the container's attribute
  container.setAttribute('class', 'imgcontainer');
  container.setAttribute('ondrop', 'drop(event)');
  container.setAttribute('ondragover', 'dragover(event)');
  return container;
}

/*
  Create a new parent container based on the split direction
  @return{ele} container:  the newly created parent container
*/
function createParentContainer(direction) {
  var container = document.createElement('div');
  // Set the container's attribute
  container.setAttribute('class', `${direction}-container`);
  return container;
}

/*
  Split the container in specified direction
  @param{string} direction:  the split direction (h or v)
  @param{ele} oldContainer:  the container to be splited
*/
function split(direction, oldContainer) {
  // split the old container in half in corresponding direction
  if (direction === 'h') {
    oldContainer.style.height = `${Math.round(oldContainer.offsetHeight/2)}px`;
    var newParentContainer = createParentContainer('h');
  } else {
    oldContainer.style.width = `${Math.round(oldContainer.offsetWidth/2)}px`;
    var newParentContainer = createParentContainer('v');
  }

  var parentContainer = oldContainer.parentNode;
  parentContainer.insertBefore(newParentContainer, oldContainer);
  newParentContainer.appendChild(oldContainer);

  // create a new container
  var newContainer = createNewContainer();

  // set the size of the new container
  if (direction === 'h') {
    newContainer.style.height = oldContainer.style.height;
    newContainer.style.width = `${oldContainer.offsetWidth}px`;
  } else {
    newContainer.style.width = oldContainer.style.width;
    newContainer.style.height = `${oldContainer.offsetHeight}px`;
  }

  // insert the newly splited element
  insertAfter(newContainer, oldContainer);

  // if the container contains an img
  if (oldContainer.children[0]) {
    // Update the image size correspondingly
    var img = oldContainer.children[0];
    updateImgSize(img, oldContainer);
  }
}

/*
  Insert a new node after the old newNode
  @param{ele} newNode: the new node to be inserted
  @param{ele} oleNode: the reference node that the new node will be inserted after
*/
function insertAfter(newNode, oldNode) {
  oldNode.parentNode.insertBefore(newNode, oldNode.nextSibling);
}

/*
  Update the img size according to its container size
  @param{ele} img
  @param{ele} container
*/
function updateImgSize(img, container) {
  if (img.width !== container.offsetWidth || img.height !== container.offsetHeight ) {
    img.width = container.offsetWidth*0.95;
    img.height = container.offsetHeight*0.95;
  }
}

/*
  Check if an element is in a layout cell/imgcontainer
  @param{ele} ele
  @return{boolean} true if the img is in a layout cell, false otherwise
*/
function inContainer(ele) {
  var check;
  if (ele.parentElement && ele.parentElement.classList.contains('imgcontainer')) {
    check = true;
  } else {
    check = false;
  }
  return check;
}
