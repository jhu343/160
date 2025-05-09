// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;

  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;
  uniform sampler2D u_Sampler4;
  uniform sampler2D u_Sampler5;
  uniform sampler2D u_Sampler6;
  
  uniform int u_whichTexture;
  void main() {
    if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor;               // use color
    } else if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV, 1.0, 1.0);      // use UV debug color
    } else if (u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV);  // use texture 0 -- sky 
    } else if (u_whichTexture == 1) {
      gl_FragColor = texture2D(u_Sampler1, v_UV);  // use texture 1 -- ground
    } else if (u_whichTexture == 2){
      gl_FragColor = texture2D(u_Sampler2, v_UV);  // use texture 2 -- dirt
    } else if (u_whichTexture == 3){
      gl_FragColor = texture2D(u_Sampler3, v_UV);  // use texture 3 -- grass
    } else if (u_whichTexture == 4){
      gl_FragColor = texture2D(u_Sampler4, v_UV);  // use texture 4 -- stone
    } else if (u_whichTexture == 5){
      gl_FragColor = texture2D(u_Sampler5, v_UV);  // use texture 5 -- prismarine
    } else if (u_whichTexture == 6){
      gl_FragColor = texture2D(u_Sampler6, v_UV);  // use texture 6 -- flower
    } else {
      gl_FragColor = vec4(1, 0.2, 0.2, 1);      // Error, put Redish 
    }
  }`;

// Global Variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;

let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;
let u_Sampler4;
let u_Sampler5;
let u_Sampler6;

let u_whichTexture;

function setUpWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  gl.enable(gl.DEPTH_TEST);
}


function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  // set an initial value for this matrix to identity
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return;
  }

  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get the storage location of u_Sampler2');
    return;
  }

  
  u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
  if (!u_Sampler3) {
    console.log('Failed to get the storage location of u_Sampler3');
    return;
  }

  u_Sampler4 = gl.getUniformLocation(gl.program, 'u_Sampler4');
  if (!u_Sampler4) {
    console.log('Failed to get the storage location of u_Sampler4');
    return;
  }

  u_Sampler5 = gl.getUniformLocation(gl.program, 'u_Sampler5');
  if (!u_Sampler5) {
    console.log('Failed to get the storage location of u_Sampler5');
    return;
  }

  u_Sampler6 = gl.getUniformLocation(gl.program, 'u_Sampler6');
  if (!u_Sampler6) {
    console.log('Failed to get the storage location of u_Sampler6');
    return;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }
};

var g_camera = new Camera();
var g_map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 1],
  [1, 0, 0, 0, 1, 1, 1, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 0, 0, 3, 3, 0, 0, 1],
  [1, 0, 0, 0, 1, 1, 1, 1, 2, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 1, 0, 0, 2, 2, 0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 2, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 2, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 3, 3, 3, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 2, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 2, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 1, 1, 1, 1, 2, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 2, 2, 2, 0, 0, 1, 1, 2, 3, 3, 2, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 3, 3, 1, 0, 0, 2, 2, 1, 0, 0, 1, 2, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 2, 2, 1, 0, 0, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 0, 2, 2, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0, 2, 5, 5, 5, 5, 5, 5, 5, 5, 1],
  [1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 5, 1],
  [1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 2, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 5, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 1],
  [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
  [1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 2, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 0, 0, 2, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 2, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 3, 0, 0, 0, 1, 0, 0, 0, 0, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 3, 0, 0, 0, 1, 3, 3, 3, 1, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 1, 1, 1, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 3, 3, 0, 0, 1, 1, 0, 0, 3, 0, 0, 1, 1, 0, 0, 0, 0, 2, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 3, 0, 0, 1, 1, 0, 0, 3, 0, 0, 3, 1, 1, 1, 1, 2, 2, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

function drawMap() {
  // g_map[x][y] = textureNum - 1:
  // 1 = sand
  // 2 = sand with grass on top
  // 3 = stone
  // 4 = prismarine
  // 5 = flowers

  var body = new Cube();
  for (x = 0; x < 32; x++) {
    for (y = 0; y < 32; y++) {
      if (g_map[x][y] == 1) {
        body.color = [1, 1, 1, 1];
        body.textureNum = 2;
        body.matrix.setTranslate(x-16, -0.75, y-16);
        body.render();
      } else if (g_map[x][y] == 2) {
        body.color = [1, 1, 1, 1];
        body.textureNum = 2;
        body.matrix.setTranslate(x-16, -0.75, y-16);
        body.render();

        body.textureNum = 3;
        body.matrix.translate(0, 1, 0);
        body.render();
      } else if (g_map[x][y] == 3) {
        body.textureNum = 4;
        body.matrix.setTranslate(x-16, -0.75, y-16);
        body.render();
      } else if (g_map[x][y] == 4) {
        body.textureNum = 5;
        body.matrix.setTranslate(x-16, -0.75, y-16);
        body.render();
      } else if (g_map[x][y] == 5) {
        body.textureNum = 6;
        body.matrix.setTranslate(x-16, -0.75, y-16);
        body.render();
      }
    }
  }
}

function renderAllShapes() {
  var startTime = performance.now();

  var projMat = new Matrix4();
  projMat.setPerspective(50, canvas.width / canvas.height, 1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  var viewMat = new Matrix4();
  viewMat.setLookAt(
    g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2], 
    g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2], 
    g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2]);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);


  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  drawMap();

  // sky
  var sky = new Cube();
  sky.color = [1, 0, 0, 1];
  sky.textureNum = 0;
  sky.matrix.scale(35, 35, 35);
  sky.matrix.translate(-0.5, -0.5, -0.5);
  sky.render();

  // ground
  var ground = new Cube();
  ground.color = [1, 0, 0, 1];
  ground.textureNum = 1;
  ground.matrix.translate(0, -0.75, 0);
  ground.matrix.scale(35, 0, 35);
  ground.matrix.translate(-0.5, 0, -0.5);
  ground.render();

  // pond
  var pond = new Cube();
  pond.color = [0.25, 0.4, 1, 1];
  pond.textureNum = -2;
  pond.matrix.translate(6, -0.745, 6);
  pond.matrix.scale(10, 0.5, 10);
  pond.render();

  renderDog();

  getCubePosition();
  // Check the time at the end of the function, and show on web page
  var duration = performance.now() - startTime;
  sendTextToHTML(' ms: ' + Math.floor(duration) + ' fps: ' + Math.floor(10000 / duration), 'numdot');
}

let cubePosition = [];
function getCubePosition() {
  for (let x = 0; x < 32; x++) {
    for (let y = 0; y < 32; y++) {
      let x_world = x - 16;
      let z_world = y - 16;
      if (g_map[x][y] === 1) {
        cubePosition.push({x: x_world, y: -0.75, z: z_world});
      } else if (g_map[x][y] > 1) {
        cubePosition.push({x: x_world, y: -0.75 + g_map[x][y], z: z_world});
      }
    }
  }
}

// Set the text of a HTML element
function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    onclose.length('Failed to get ' + htmlID + ' from HTML');
    return;
  }
  htmlElm.innerHTML = text;
};


var g_startTime = performance.now() / 500.0;
var g_seconds = performance.now() / 500.0 - g_startTime;

// called by browser repeatedly whenever its time
function tick() {
  // print some debug information so we know it's running
  g_seconds = performance.now() / 500.0 - g_startTime;

  // draw everything
  renderAllShapes();

  // tell the browser to update again when it has time
  requestAnimationFrame(tick);
}

function initTextures() {
  loadTexture('./pic/sky.jpg', 0, u_Sampler0);
  loadTexture('./pic/ground.jpg', 1, u_Sampler1);
  loadTexture('./pic/dirt.png', 2, u_Sampler2);
  loadTexture('./pic/grass.png', 3, u_Sampler3);
  loadTexture('./pic/stone.png', 4, u_Sampler4);
  loadTexture('./pic/marine.png', 5, u_Sampler5);
  loadTexture('./pic/flower.png', 6, u_Sampler6);
  // add more texture loading...
  return true;
}

function loadTexture(src, index, sampler) {
  var image = new Image();  // create the image object
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image.onload = function () {
    sendTextureToGLSL(image, index, sampler);
  };
  image.src = src;
}

function sendTextureToGLSL(image, index, sampler) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // flip the image's y axis

  // enable texture unit0
  gl.activeTexture(gl.TEXTURE0 + index);
  // bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // set the texture unit 0 to the sampler
  gl.uniform1i(sampler, index);
}

function keydown(ev) {
  if (ev.keyCode == 87) {  // w
    g_camera.moveForward();
  } else if (ev.keyCode == 83) {  // s
    g_camera.moveBack();
  } else if (ev.keyCode == 65) {  // a
    g_camera.moveLeft()
  } else if (ev.keyCode == 68) {  // d
    g_camera.moveRight()
  } else if (ev.keyCode == 81) {  // q
    g_camera.panLeft();
  } else if (ev.keyCode == 69) {  // e
    g_camera.panRight();
  } else if (ev.keyCode ==  82) { // r
    g_camera.panUp();
  } else if (ev.keyCode == 70) {  // f
    g_camera.panDown();
  } else if (ev.keyCode == 90) { // z
    g_camera.moveUp();
  } else if (ev.keyCode == 88) { // x
    g_camera.moveDown();
  }
  renderAllShapes();
}


function main() {
  setUpWebGL();
  connectVariablesToGLSL();

  let isDragging = false;
  let lastX = 0, lastY = 0;

  canvas.onmousedown = function (e) {
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
  };

  canvas.onmouseup = function (e) {
    isDragging = false;
  }

  // Move camera
  canvas.onmousemove = function (e) {
    if (!isDragging) {
      return;
    }
    let dx = e.clientX - lastX;
    let dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    g_camera.onMove(dx, dy);
  }

  document.onkeydown = keydown;

  initTextures();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  requestAnimationFrame(tick);
}

