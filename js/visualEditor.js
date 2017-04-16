// Add the saved layout to dropdown
(function addSavedLayout() {
  // Save previously saved layouts in localStorage
  for (let i = 0, len = localStorage.length; i < len; i++) {
    addLayout(localStorage.key(i));
  }
})();


/*
  Event listener for clicking an img container
  highlight a clicked img container
*/
document.addEventListener('drag', (event) => {
  var ele = event.target;
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
  handleSplit('h');
})

/*
  Event listener for clicking the 'split vertically' button
  split the clicked container vertically
*/
document.getElementById('js-btn-split-v').addEventListener('click', () => {
  handleSplit('v');
})

/*
  Keyboard shortcut for splitting
*/
document.addEventListener('keydown', (event) => {
  var keyCode = event.which;
  var arrow = {up: 38, down: 40, left:37, right:39};
  switch(keyCode) {
    case arrow.up:
      handleSplit('h');
      break;
    case arrow.down:
      handleSplit('h');
      break;
    case arrow.right:
      handleSplit('v');
      break;
    case arrow.left:
      handleSplit('v');
      break;
  }
})

/*
  Event listener for clicking the 'save' button
  split the clicked container vertically
*/
document.getElementById('js-btn-save').addEventListener('click', () => {
  // save the current layout as html
  var layout = document.getElementsByClassName('section-view')[0].innerHTML;
  // prompt the user to enter a name for the layout
  var name =  prompt("Give a name for your layout", "default");
  // make sure the user enters a name
  while (name === "") {
    name = prompt("Please enter a name for your layout, this cannot be blank", "default");
  }
  if (name != null) {
    // save the current layout in local storage
    localStorage.setItem(name, JSON.stringify(layout));
    // add the name as an option to the dropdown menu
    addLayout(name);
  } else {
    alert("Save failed, please try again");
  }

})

/*
  Event listener for clicking the option items under the 'load' button
  remove the current view and load the saved view
*/
document.addEventListener('click', (event) => {
  var ele = event.target;
  if (ele.classList.contains('dropdown-item')) {
    // get the layout name
    let name = ele.innerHTML;
    // remove the current layout
    document.getElementsByClassName('section-view')[0].innerHTML = '';
    // load the selected layout from localstorage;
    var selected_layout = JSON.parse(localStorage.getItem(name));
    // insert the selected layout
    document.getElementsByClassName('section-view')[0].innerHTML = selected_layout;
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

  var source_type = event.dataTransfer.getData('type');

  // Drag img to container
  if (source_type === "IMG") {
    handleImgDrag(event);
  }

  // Drag cell to another cell, swap the content
  if (source_type === "DIV") {
    handleContainerDrag(event);
  }
}

/*
  Handle dragging image to a container
  append the image as backgroundImage of the container
  @param{event} event:  the drag event
*/
function handleImgDrag(event) {
  // get the target container
  var target_container = event.target;
  // get the source img
  var source_id = event.dataTransfer.getData('id');
  var source_img = document.getElementById(source_id);

  // check if the container already contains an img, only append img when it does not
  if (target_container.style.backgroundImage === "") {
    source_img = `url(${source_img.src})`
    appendImg(source_img, target_container);
    highlight(target_container);
  }
}

/*
  Handle dragging container to another container
  swap the content
  @param{event} event:  the drag event
*/
function handleContainerDrag(event) {
  // get the target container
  var target_container = event.target;
  // get the source container
  var source_id = event.dataTransfer.getData('id'); // id = imgcontainer-clicked
  var source_container = document.getElementById(source_id);
  console.log(source_container);

  // get the target container's background image
  var target_img = target_container.style.backgroundImage;
  var source_img = source_container.style.backgroundImage;
  
  // swap the container's content
  swapImg(source_container, target_container, source_img, target_img);
  highlight(target_container);
}


/*
  Append img to a container
  @param{ele} img
  @param{ele} container
*/
function appendImg(img, container) {
  // Resize the img to fit in the container
  updateImgSize(img, container)
  // when drops, set the img as background of the container
  container.style.backgroundImage = img;
}

/*
  Swap img between containers
  @param{ele} sc:   source container
  @param{ele} tc:   target container
  @param{ele} simg: source img
  @param{ele} timg: target img
*/
function swapImg(sc, tc, simg, timg) {
  // append img to the other container
  appendImg(simg, tc);
  appendImg(timg, sc);
}

/*
  Highlight a clicked img container
  @param{ele} container:  the container to be highlighted
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
  @param{string} direction: the split direction (h or v)
  @return{ele} container:   the newly created parent container
*/
function createParentContainer(direction) {
  var container = document.createElement('div');
  // Set the container's attribute
  container.setAttribute('class', `${direction}-container`);
  return container;
}

/*
  Handle the split
  @param{string} direction: the split direction (h or v)
*/
function handleSplit(direction) {
  // get the clicked container
  var oldContainer = document.getElementById('imgcontainer-clicked');

  // Check if there is clicked imgcontainer
  if (oldContainer) {
    // Make sure the container after split is not too small (should be larger than 60)
    if (direction === 'h') {
      if (oldContainer.offsetHeight/2 >= 30) {
        split('h', oldContainer);
      }
    } else {
      if (oldContainer.offsetWidth/2 >= 30) {
        split('v', oldContainer);
      }
    }
  } else {
    alert("Please select a cell to split");
  }
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

  // Create a parent container for the newly created two splitted cells
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
  // resize the image
  container.style.backgroundSize = `${container.offsetWidth}px ${container.offsetHeight}px`;
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

/*
  Add an option under the load dropdown menu
  @param{string} name:  name of the layout to be saved as the option
*/
function addLayout(name) {
  // create the option element
  var optionContainer = document.createElement('li');
  var option = document.createElement('a');
  // name the option
  option.innerHTML = name;
  // set the option's attribute for setting event listener for loading
  option.setAttribute('class', 'dropdown-item');
  // append the option to the dropdown menu
  optionContainer.appendChild(option);
  document.getElementsByClassName('dropdown-menu')[0].append(optionContainer);
}

// Initialize the dropdown
$('.dropdown-toggle').dropdown();
