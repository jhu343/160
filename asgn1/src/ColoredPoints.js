// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = u_Size;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`;

// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let u_cosB;
let u_sinB;


function setUpWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  // gl = getWebGLContext(canvas);
  gl = canvas.getContext('webgl', {preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}


function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
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

  // Get the storage loaction of u_Size
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
};


var g_shapesList = [];

function click(ev) {
  let [x, y] = convertCoordinatesEventToGL(ev);
  // Create and store the new point
  if (g_selectedType == POINT) {
    point = new Point();
  } else if (g_selectedType == TRIANGLE) {
    point = new Triangle();
  } else if (g_selectedType == CIRCLE) {
    point = new Circle();
  } else if (g_selectedType == POLYGON) {
    point = new Circle();
  }

  point.position = [x, y];
  point.color = g_selectedColor.slice();
  // .slice() force a copy of all elements in the array instead of just the pointer
  // or construct a new array using the elements --[g[0], g[1], ...];
  point.size = g_selectedSize;
  if (g_selectedType == CIRCLE) {
    point.segments = g_selectedSeg;
  }
  if (g_selectedType == TRIANGLE) {
    point.angle = g_rotateAngle;
  }
  if (g_selectedType == POLYGON) {
    point.segments = g_selectedSide;
  }
  g_shapesList.push(point);

  // Draw every shape that is supposed to be in the canvas
  renderAllShapes();
}


// Extract the event click and return it in WebGL coordinates
function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x, y]);
}


// Draw every shape that is supposed to be in the canvas
function renderAllShapes() {
  // check the time at the start of this function
  var startTime = performance.now();

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;
  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }

  // Check the time at the end of the function, and show on web page
  var duration = performance.now() - startTime;
  sendTextToHTML('numdot: ' + len + ' ms: ' + Math.floor(duration) + ' fps: ' + Math.floor(10000/duration), 'numdot');
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


// Contants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
const POLYGON = 3;

// Globals related to UI elements
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 10;
let g_selectedType = POINT;
let g_selectedSeg = 13;
let g_rotateAngle = 0.0;
let g_selectedSide = 4;

// Set up actions for the HTML UI elements
function addActionsForHtmlUI() {
  // Button Events (Shape Type)
  document.getElementById('clearButton').onclick = function() {
    g_shapesList = [];
    renderAllShapes();
  };
  document.getElementById('pointButton').onclick = function() {
    g_selectedType = POINT;
  };
  document.getElementById('triButton').onclick = function() {
    g_selectedType = TRIANGLE;
  };
  document.getElementById('circleButton').onclick = function() {
    g_selectedType = CIRCLE;
  };
  document.getElementById('polyButton').onclick = function() {
    g_selectedType = POLYGON;
  };
  document.getElementById('paintButton').onclick = function(){
    createPaint();
  };

  // Slider Events
  document.getElementById('redSlide').addEventListener('mouseup', function() {
    g_selectedColor[0] = this.value / 100;
  });
  document.getElementById('greenSlide').addEventListener('mouseup', function() {
    g_selectedColor[1] = this.value / 100;
  });
  document.getElementById('blueSlide').addEventListener('mouseup', function() {
    g_selectedColor[2] = this.value / 100;
  });
  document.getElementById('sizeSlide').addEventListener('mouseup', function() {
    g_selectedSize = this.value;
  });
  document.getElementById('segSlide').addEventListener('mouseup', function() {
    g_selectedSeg = this.value;
  });
  document.getElementById('angleSlide').addEventListener('mouseup', function() {
    g_rotateAngle = this.value;
  });
  document.getElementById('alphaSlide').addEventListener('mouseup', function() {
    g_selectedColor[3] = this.value / 100;
  });
  document.getElementById('polySlide').addEventListener('mouseup', function() {
    g_selectedSide = this.value;
  });
}

function createPaint() {
  g_shapesList = [];
  
  // colors
  let yellow = [0.9, 1, 0, 0.5];
  let brown = [0.8, 0.5, 0, 1];
  let black = [0, 0, 0, 1];
  let white = [1, 1, 1, 1];
  
  // face
  let point1 = new Point();
  point1.position = [0, 0];
  point1.color = yellow;
  point1.size = 200;
  g_shapesList.push(point1);

  let point2 = new Point();
  point2.position = [0.625, 0.25];
  point2.color = yellow;
  point2.size = 50;
  g_shapesList.push(point2);

  let point3 = new Point();
  point3.position = [0.625, 0.0];
  point3.color = yellow;
  point3.size = 50;
  g_shapesList.push(point3);

  let point4 = new Point();
  point4.position = [0.625, -0.25];
  point4.color = yellow;
  point4.size = 50;
  g_shapesList.push(point4);

  let point5 = new Point();
  point5.position = [-0.625, 0.25];
  point5.color = yellow;
  point5.size = 50;
  g_shapesList.push(point5);

  let point6 = new Point();
  point6.position = [-0.625, 0.0];
  point6.color = yellow;
  point6.size = 50;
  g_shapesList.push(point6);

  let point7 = new Point();
  point7.position = [-0.625, -0.25];
  point7.color = yellow;
  point7.size = 50;
  g_shapesList.push(point7);

  let point8 = new Point();
  point8.position = [0.563, 0.437];
  point8.color = yellow;
  point8.size = 25;
  g_shapesList.push(point8);

  let tri1 = new Triangle();
  tri1.position = [0.625, 0.375];
  tri1.color = yellow;
  tri1.size = 25;
  g_shapesList.push(tri1);

  let point9 = new Point();
  point9.position = [0.563, -0.437];
  point9.color = yellow;
  point9.size = 25;
  g_shapesList.push(point9);

  let tri2 = new Triangle();
  tri2.position = [0.625, -0.375];
  tri2.color = yellow;
  tri2.size = 25;
  tri2.angle = 90.0;
  g_shapesList.push(tri2);

  let point10 = new Point();
  point10.position = [-0.563, -0.437];
  point10.color = yellow;
  point10.size = 25;
  g_shapesList.push(point10);

  let tri3 = new Triangle();
  tri3.position = [-0.625, -0.375];
  tri3.color = yellow;
  tri3.size = 25;
  tri3.angle = 180.0;
  g_shapesList.push(tri3);

  let point11 = new Point();
  point11.position = [-0.563, 0.437];
  point11.color = yellow;
  point11.size = 25;
  g_shapesList.push(point11);

  let tri4 = new Triangle();
  tri4.position = [-0.625, 0.375];
  tri4.color = yellow;
  tri4.size = 25;
  tri4.angle = 270.0;
  g_shapesList.push(tri4);

  // ears
  let tri5 = new Triangle();
  tri5.position = [0.75, 0.5];
  tri5.color = brown;
  tri5.size = 25;
  tri5.angle = 180.0;
  g_shapesList.push(tri5);

  let tri6 = new Triangle();
  tri6.position = [-0.75, 0.5];
  tri6.color = brown;
  tri6.size = 25;
  tri6.angle = 90.0;
  g_shapesList.push(tri6);

  let tri7 = new Triangle();
  tri7.position = [0.75, 0.5];
  tri7.color = brown;
  tri7.size = 75;
  tri7.angle = 270.0;
  g_shapesList.push(tri7);

  let tri8 = new Triangle();
  tri8.position = [-0.75, 0.5];
  tri8.color = brown;
  tri8.size = 75;
  tri8.angle = 0.0;
  g_shapesList.push(tri8);

  // eyes
  let tri9 = new Triangle();
  tri9.position = [0.375, 0.125];
  tri9.color = white;
  tri9.size = 50;
  tri9.angle = 270.0;
  g_shapesList.push(tri9);

  let tri10 = new Triangle();
  tri10.position = [0.375, 0.125];
  tri10.color = white;
  tri10.size = 50;
  tri10.angle = 180.0;
  g_shapesList.push(tri10);

  let tri11 = new Triangle();
  tri11.position = [0.375, 0.125];
  tri11.color = white;
  tri11.size = 50;
  tri11.angle = 0.0;
  g_shapesList.push(tri11);

  let tri12 = new Triangle();
  tri12.position = [0.375, 0.125];
  tri12.color = white;
  tri12.size = 50;
  tri12.angle = 90.0;
  g_shapesList.push(tri12);

  let point12 = new Point();
  point12.position = [0.375, 0.125];
  point12.color = black;
  point12.size = 25;
  g_shapesList.push(point12);

  let point13 = new Point();
  point13.position = [0.375, 0.25];
  point13.color = black;
  point13.size = 25;
  g_shapesList.push(point13);

  let point14 = new Point();
  point14.position = [0.375, 0.0];
  point14.color = black;
  point14.size = 25;
  g_shapesList.push(point14);

  let tri13 = new Triangle();
  tri13.position = [-0.375, 0.125];
  tri13.color = white;
  tri13.size = 50;
  tri13.angle = 270.0;
  g_shapesList.push(tri13);

  let tri14 = new Triangle();
  tri14.position = [-0.375, 0.125];
  tri14.color = white;
  tri14.size = 50;
  tri14.angle = 180.0;
  g_shapesList.push(tri14);

  let tri15 = new Triangle();
  tri15.position = [-0.375, 0.125];
  tri15.color = white;
  tri15.size = 50;
  tri15.angle = 0.0;
  g_shapesList.push(tri15);

  let tri16 = new Triangle();
  tri16.position = [-0.375, 0.125];
  tri16.color = white;
  tri16.size = 50;
  tri16.angle = 90.0;
  g_shapesList.push(tri16);

  let point15 = new Point();
  point15.position = [-0.375, 0.125];
  point15.color = black;
  point15.size = 25;
  g_shapesList.push(point15);

  let point16 = new Point();
  point16.position = [-0.375, 0.25];
  point16.color = black;
  point16.size = 25;
  g_shapesList.push(point16);

  let point17 = new Point();
  point17.position = [-0.375, 0.0];
  point17.color = black;
  point17.size = 25;
  g_shapesList.push(point17);

  let point18 = new Point();
  point18.position = [-0.375, 0.375];
  point18.color = yellow;
  point18.size = 25;
  g_shapesList.push(point18);

  let point19 = new Point();
  point19.position = [0.375, 0.375];
  point19.color = yellow;
  point19.size = 25;
  g_shapesList.push(point19);

  let point20 = new Point();
  point20.position = [0.375, -0.125];
  point20.color = yellow;
  point20.size = 25;
  g_shapesList.push(point20);

  let point21 = new Point();
  point21.position = [-0.375, -0.125];
  point21.color = yellow;
  point21.size = 25;
  g_shapesList.push(point21);

  // mouth
  let tri17 = new Triangle();
  tri17.position = [0.115, -0.15];
  tri17.color = brown;
  tri17.size = 25;
  tri17.angle = 90.0;
  g_shapesList.push(tri17);
  
  let tri18 = new Triangle();
  tri18.position = [0.115, -0.15];
  tri18.color = brown;
  tri18.size = 25;
  tri18.angle = 180.0;
  g_shapesList.push(tri18);
  
  let tri19 = new Triangle();
  tri19.position = [-0.115, -0.15];
  tri19.color = brown;
  tri19.size = 25;
  tri19.angle = 90.0;
  g_shapesList.push(tri19);

  let tri20 = new Triangle();
  tri20.position = [-0.115, -0.15];
  tri20.color = brown;
  tri20.size = 25;
  tri20.angle = 180.0;
  g_shapesList.push(tri20);

  renderAllShapes();
}


function main() {
  setUpWebGL();
  connectVariablesToGLSL();
  
  // Set up action for the HTML elements
  addActionsForHtmlUI()

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) {
    if (ev.buttons == 1) {
      click(ev);
    }
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

