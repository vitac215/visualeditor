/*
  Event listener for clicking an img container
  highlight a clicked img container
*/
document.addEventListener('click', (e) => {
  var ele = e.target;
  // if the clicked element is a imgcontainer
  if (ele.tagName === 'DIV' && ele.classList.contains('imgcontainer')) {
    highlight(ele);
  }
})

/*
  Event listener for clicking the add button
  append a new contaienr to the layout area
*/
document.getElementById('js-btn-add').addEventListener('click', () => {
  var newContainer = createNewContainer();
  document.getElementsByClassName('section-layout')[0].append(newContainer);
})


document.getElementById('js-btn-split-h').addEventListener('click', () => {
  // get the clicked container
  var oldContainer = document.getElementById('imgcontainer-clicked');

  // Make sure the container after split is not too small (should be larger than 60)
  if (oldContainer && oldContainer.offsetHeight/2 >= 60) {
    // split the height in half
    oldContainer.style.height = `${oldContainer.offsetHeight/2}px`;

    // create a new container
    var newContainer = createNewContainer();
    // set the height of the new container
    newContainer.style.height = oldContainer.style.height;
    // insert the new container after the old container;
    insertAfter(newContainer, oldContainer);
  }
})


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
  Insert a new node after the old newNode
  @param{ele} newNode: the new node to be inserted
  @param{ele} oleNode: the reference node that the new node will be inserted after
*/
function insertAfter(newNode, oldNode) {
  oldNode.parentNode.insertBefore(newNode, oldNode.nextSibling);
}
