// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
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
let u_ModelMatrix;
let u_GlobalRotateMatrix;

let cameraX = 30;
let cameraY = -10;
let mouseX = 0;
let mouseY = 0;

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

  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  // set an initial value for this matrix to identity
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, identityM.elements);
};

// Update the angles of everything if currently animated
function updateAnimationAngles() {
  if (g_animation) {
    g_animateAngle = (45 * Math.sin(g_seconds));
    leftFrontLegTopAngle = g_animateAngle / 3;
    leftFrontLegBottomAngle = Math.min(0, -g_animateAngle / 3);

    rightFrontLegTopAngle = -g_animateAngle / 3;
    rightFrontLegBottomAngle = Math.min(0, g_animateAngle / 3);

    leftBackLegTopAngle = rightFrontLegTopAngle;
    leftBackLegBottomAngle = rightFrontLegBottomAngle;

    rightBackLegTopAngle = leftFrontLegTopAngle;
    rightBackLegBottomAngle = leftFrontLegBottomAngle;

    if (dogSad) {
      tailFrontAngle = 120;
      tailLeftAngle = g_animateAngle / 3;
    } else {
      tailFrontAngle = g_animateAngle / 3;
      tailLeftAngle = g_animateAngle / 3;
    }


    if (Math.floor(g_seconds % 10) === 1) {
      leftEyeClose = 5;
      rightEyeClose = 5;
      setTimeout(function () {
        leftEyeClose = 1;
        rightEyeClose = 1;
      }, 500);
    }
  }
  if (followCursor) {
    leftEyeX = (mouseX - canvas.width / 2) / 800;
    leftEyeY = Math.max((200 - mouseY) / 400, 0);
    rightEyeX = leftEyeX;
    rightEyeY = leftEyeY;
  }
  updateSlider();
}


// Draw every shape that is supposed to be in the canvas
function renderAllShapes() {
  // color
  const brown = [0.627, 0.322, 0.176, 1.0];
  const lightBrown = [0.87, 0.72, 0.53, 1.0];
  const darkBrown = [0.227, 0.149, 0.149, 1.0];
  const red = [0.65, 0.08, 0.08, 1.0];
  const white = [1, 1, 1, 1];
  const black = [0, 0, 0, 1];
  const groundColor = white;
  const lightBlue = [0.75, 0.86, 0.92, 1.0];
  const lightYellow = [1, 0.93, 0.73, 1.0];
  
  let bgColor = dogSad? lightBlue: lightYellow;

  // check the time at the start of this function
  var startTime = performance.now();

  // Pass the matrix to u_ModelMatrix attribute
  var globalRotMat = new Matrix4()
    .rotate(cameraX, 0, 1, 0)
    .rotate(cameraY, 1, 0, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clearColor(bgColor[0], bgColor[1], bgColor[2], bgColor[3]);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


  // background
  if (cameraY < 0 || cameraY > 180) {
    var ground = new Disk();
    ground.color = groundColor;
    ground.matrix = new Matrix4();
    ground.matrix.setTranslate(0, -0.635, 0.25);
    ground.matrix.rotate(90, 1, 0, 0);
    ground.matrix.scale(1.25, 1.25, 1.25);
    ground.render();
  }

  // Draw animal
  // Head --------------------
  var face = new Cube();
  face.color = brown;
  face.matrix.rotate(-headAngle, 0, 0, 1);
  face.matrix.translate(0, dogY, 0);
  // var faceCoordinateMat = new Matrix4(face.matrix);
  face.matrix.translate(-0.175, -0.175, -0.175);
  face.matrix.scale(0.35, 0.35, 0.35);
  face.render();

  var nose = new Cube();
  nose.color = brown;
  nose.matrix = new Matrix4(face.matrix);
  nose.matrix.translate(0, 0, -0.5);
  nose.matrix.scale(1, 0.5, 0.5);
  nose.render();

  var nosetip = new Cube();
  nosetip.color = darkBrown;
  nosetip.matrix = new Matrix4(face.matrix);
  nosetip.matrix.translate(0.35, 0, -0.65);
  nosetip.matrix.scale(0.35, 0.25, 0.15);
  nosetip.render();


  var mouth = new Cube();
  mouth.color = lightBrown;
  mouth.matrix = new Matrix4(face.matrix);
  mouth.matrix.translate(0, -0.5 - openMouth, 0);
  mouth.matrix.scale(1, 0.5 + openMouth, 0.5);
  mouth.render();

  var upperLip = new Cube();
  upperLip.color = lightBrown;
  upperLip.matrix = new Matrix4(face.matrix);
  upperLip.matrix.translate(0, -0.25, -0.5);
  upperLip.matrix.scale(1, 0.25, 0.5);
  upperLip.render();


  var lowerLip = new Cube();
  lowerLip.color = lightBrown;
  lowerLip.matrix = new Matrix4(face.matrix);
  lowerLip.matrix.translate(0, -0.5 - openMouth, -0.25);
  lowerLip.matrix.scale(1, 0.125, 0.25);
  lowerLip.render();

  var tongue = new Cube();
  tongue.color = red;
  tongue.matrix = new Matrix4(face.matrix);
  tongue.matrix.translate(0.25, -0.375 - openMouth, -0.25);
  tongue.matrix.scale(0.5, 0.125, 0.25);
  tongue.render();

  var eyeMiddle = new Cube();
  eyeMiddle.color = brown;
  eyeMiddle.matrix = new Matrix4(face.matrix);
  eyeMiddle.matrix.translate(0.45, 0.5, -0.1, 0);
  eyeMiddle.matrix.scale(0.1, 0.5, 0.1);
  eyeMiddle.render();

  var leftEyeLidTop = new Cube();
  leftEyeLidTop.color = brown;
  leftEyeLidTop.matrix = new Matrix4(face.matrix);
  leftEyeLidTop.matrix.translate(0.1, 0.9, -0.1, 0);
  leftEyeLidTop.matrix.scale(0.35, 0.1, 0.1)
  leftEyeLidTop.render();

  var leftEyeLidSide = new Cube();
  leftEyeLidSide.color = brown;
  leftEyeLidSide.matrix = new Matrix4(face.matrix);
  leftEyeLidSide.matrix.translate(0, 0.5, -0.1, 0);
  leftEyeLidSide.matrix.scale(0.1, 0.5, 0.1)
  leftEyeLidSide.render();

  var leftEyeLid = new Cube();
  leftEyeLid.color = brown;
  leftEyeLid.matrix = new Matrix4(leftEyeLidTop.matrix);
  leftEyeLid.matrix.translate(1, 1, 0, 0);
  leftEyeLid.matrix.scale(1, leftEyeClose, 1);
  leftEyeLid.matrix.translate(-1, -1, -1, 0);
  leftEyeLid.render();



  var leftEyewhite = new Cube();
  leftEyewhite.color = white;
  leftEyewhite.matrix = new Matrix4(face.matrix);
  leftEyewhite.matrix.translate(0.1, 0.5, -0.1, 0);
  leftEyewhite.matrix.scale(0.35, 0.4, 0.1);
  leftEyewhite.render();

  var leftEye = new Cube();
  leftEye.color = black;
  leftEye.matrix = new Matrix4(leftEyewhite.matrix);
  leftEye.matrix.translate(leftEyeX, leftEyeY, 0);
  leftEye.matrix.translate(0.25, 0, -0.5);
  leftEye.matrix.scale(0.55, 0.5, 0.5);
  leftEye.render();

  var rightEyewhite = new Cube();
  rightEyewhite.color = white;
  rightEyewhite.matrix = new Matrix4(face.matrix);
  rightEyewhite.matrix.translate(0.55, 0.5, -0.1, 0);
  rightEyewhite.matrix.scale(0.35, 0.4, 0.1);
  rightEyewhite.render();

  var rightEyeLidTop = new Cube();
  rightEyeLidTop.color = brown;
  rightEyeLidTop.matrix = new Matrix4(face.matrix);
  rightEyeLidTop.matrix.translate(0.55, 0.9, -0.1, 0);
  rightEyeLidTop.matrix.scale(0.35, 0.1, 0.1)
  rightEyeLidTop.render();

  var rightEyeLidSide = new Cube();
  rightEyeLidSide.color = brown;
  rightEyeLidSide.matrix = new Matrix4(face.matrix);
  rightEyeLidSide.matrix.translate(0.9, 0.5, -0.1, 0);
  rightEyeLidSide.matrix.scale(0.1, 0.5, 0.1)
  rightEyeLidSide.render();

  var rightEyeLid = new Cube();
  rightEyeLid.color = brown;
  rightEyeLid.matrix = new Matrix4(rightEyeLidTop.matrix);
  rightEyeLid.matrix.translate(1, 1, 0, 0);
  rightEyeLid.matrix.scale(1, rightEyeClose, 1);
  rightEyeLid.matrix.translate(-1, -1, -1, 0);
  rightEyeLid.render();

  var rightEye = new Cube();
  rightEye.color = black;
  rightEye.matrix = new Matrix4(rightEyewhite.matrix);
  rightEye.matrix.translate(rightEyeX, rightEyeY, 0);
  rightEye.matrix.translate(0.25, 0, -0.5);
  rightEye.matrix.scale(0.55, 0.5, 0.5);
  rightEye.render();

  // ears --------------------
  var leftEarBottom = new Cube();
  leftEarBottom.color = brown;
  leftEarBottom.matrix = new Matrix4(face.matrix);
  leftEarBottom.matrix.translate(-0.1, 0.8, 0);
  leftEarBottom.matrix.scale(0.3, 0.45, 0.25);
  leftEarBottom.render();

  var leftEarTop = new Cube();
  leftEarTop.color = darkBrown;
  leftEarTop.matrix = new Matrix4(face.matrix);
  // leftEarTop.matrix.translate(-0.1, 1.25, 0);
  // leftEarTop.matrix.scale(0.3, 0.125, 0.25);
  leftEarTop.matrix.translate(-0.1, 1, -0.125);
  leftEarTop.matrix.scale(0.3, 0.25, 0.125);
  leftEarTop.render();

  var rightEarBottom = new Cube();
  rightEarBottom.color = brown;
  rightEarBottom.matrix = new Matrix4(face.matrix);
  rightEarBottom.matrix.translate(0.8, 0.8, 0);
  rightEarBottom.matrix.scale(0.3, 0.45, 0.25);
  rightEarBottom.render();

  var rightEarTop = new Cube();
  rightEarTop.color = darkBrown;
  rightEarTop.matrix = new Matrix4(face.matrix);
  // rightEarTop.matrix.translate(0.8, 1.25, 0);
  // rightEarTop.matrix.scale(0.3, 0.125, 0.25);
  rightEarTop.matrix.translate(0.8, 1, -0.125);
  rightEarTop.matrix.scale(0.3, 0.25, 0.125);
  rightEarTop.render();

  // Body --------------------
  var body = new Cube();
  body.color = brown;
  // body.matrix = faceCoordinateMat;
  body.matrix.translate(0, dogY, 0);
  body.matrix.translate(-0.175, -0.175, 0.175);
  body.matrix.scale(0.35, 0.25, 0.5);
  body.render();

  var lowerBody = new Cube();
  lowerBody.color = brown;
  lowerBody.matrix = new Matrix4(body.matrix);
  lowerBody.matrix.translate(0, -0.7, -0.35, 0);
  lowerBody.matrix.scale(1, 0.7, 1.35);
  lowerBody.render();

  // Legs --------------------
  // left front leg
  var leftFrontLegJoint = new Cube();
  leftFrontLegJoint.color = brown;
  leftFrontLegJoint.matrix = new Matrix4(body.matrix);
  leftFrontLegJoint.matrix.translate(0, -0.75, -0.35, 0);
  leftFrontLegJoint.matrix.scale(0.25, 0.1, 0.25);
  leftFrontLegJoint.render();

  var leftFrontLegTop = new Cube();
  leftFrontLegTop.color = brown;
  leftFrontLegTop.matrix = new Matrix4(body.matrix);
  var leftFrontLegMat = leftFrontLegTop.matrix;
  leftFrontLegTop.matrix.translate(0, -0.5, -0.35, 0);
  leftFrontLegTop.matrix.scale(1, 0.75, 1);
  leftFrontLegTop.matrix.scale(0.25, 0.75, 0.25);
  leftFrontLegTop.matrix.rotate(leftFrontLegTopAngle, 1, 0, 0);
  leftFrontLegTop.matrix.rotate(90, 1, 0, 0);
  leftFrontLegTop.render();

  var leftFrontKnee = new Cube();
  leftFrontKnee.color = brown;
  leftFrontKnee.matrix = new Matrix4(leftFrontLegMat);
  leftFrontKnee.matrix.translate(0, 0, 1, 0);
  leftFrontKnee.matrix.scale(1, 1, 0.15);
  leftFrontKnee.render();

  var leftFrontLegBottom = new Cube();
  leftFrontLegBottom.color = brown;
  leftFrontLegBottom.matrix = new Matrix4(leftFrontLegMat);
  var leftFrontLegBottomMat = leftFrontLegBottom.matrix;
  leftFrontLegBottom.matrix.translate(0, 0, 1, 0);
  leftFrontLegBottom.matrix.scale(1, 1, 0.75);
  leftFrontLegBottom.matrix.rotate(leftFrontLegBottomAngle, 1, 0, 0);
  leftFrontLegBottom.render();

  var leftFrontFoot = new Cube();
  leftFrontFoot.color = lightBrown;
  leftFrontFoot.matrix = new Matrix4(leftFrontLegBottomMat);
  leftFrontFoot.matrix.translate(0, -0.5, 1);
  leftFrontFoot.matrix.scale(1, 1.5, 0.5);
  leftFrontFoot.render();

  // right front leg
  var rightFrontLegJoint = new Cube();
  rightFrontLegJoint.color = brown;
  rightFrontLegJoint.matrix = new Matrix4(body.matrix);
  rightFrontLegJoint.matrix.translate(0.75, -0.75, -0.35, 0);
  rightFrontLegJoint.matrix.scale(0.25, 0.1, 0.25);
  rightFrontLegJoint.render();

  var rightFrontLegTop = new Cube();
  rightFrontLegTop.color = brown;
  rightFrontLegTop.matrix = new Matrix4(body.matrix);
  var rightFrontLegMat = rightFrontLegTop.matrix;
  rightFrontLegTop.matrix.translate(0.75, -0.5, -0.35, 0);
  rightFrontLegTop.matrix.scale(1, 0.75, 1);
  rightFrontLegTop.matrix.scale(0.25, 0.75, 0.25);
  rightFrontLegTop.matrix.rotate(rightFrontLegTopAngle, 1, 0, 0);
  rightFrontLegTop.matrix.rotate(90, 1, 0, 0);
  rightFrontLegTop.render();

  var rightFrontKnee = new Cube();
  rightFrontKnee.color = brown;
  rightFrontKnee.matrix = new Matrix4(rightFrontLegMat);
  rightFrontKnee.matrix.translate(0, 0, 1, 0);
  rightFrontKnee.matrix.scale(1, 1, 0.15);
  rightFrontKnee.render();

  var rightFrontLegBottom = new Cube();
  rightFrontLegBottom.color = brown;
  rightFrontLegBottom.matrix = new Matrix4(rightFrontLegMat);
  rightFrontLegBottom.matrix.translate(0, 0, 1, 0);
  rightFrontLegBottom.matrix.scale(1, 1, 0.75);
  rightFrontLegBottom.matrix.rotate(rightFrontLegBottomAngle, 1, 0, 0);
  rightFrontLegBottom.render();

  var rightFrontFoot = new Cube();
  rightFrontFoot.color = lightBrown;
  rightFrontFoot.matrix = new Matrix4(rightFrontLegBottom.matrix);
  rightFrontFoot.matrix.translate(0, -0.5, 1);
  rightFrontFoot.matrix.scale(1, 1.5, 0.5);
  rightFrontFoot.render();

  // left back leg
  var leftBackLegJoint = new Cube();
  leftBackLegJoint.color = brown;
  leftBackLegJoint.matrix = new Matrix4(body.matrix);
  leftBackLegJoint.matrix.translate(0, -0.75, 0.75, 0);
  leftBackLegJoint.matrix.scale(0.25, 0.1, 0.25);
  leftBackLegJoint.render();

  var leftBackLegTop = new Cube();
  leftBackLegTop.color = brown;
  leftBackLegTop.matrix = new Matrix4(body.matrix);
  var leftBackLegMat = leftBackLegTop.matrix;
  leftBackLegTop.matrix.translate(0, -0.5, 0.75, 0);
  leftBackLegTop.matrix.scale(1, 0.75, 1);
  leftBackLegTop.matrix.scale(0.25, 0.75, 0.25);
  leftBackLegTop.matrix.rotate(leftBackLegTopAngle, 1, 0, 0);
  leftBackLegTop.matrix.rotate(90, 1, 0, 0);
  leftBackLegTop.render();

  var leftBackKnee = new Cube();
  leftBackKnee.color = brown;
  leftBackKnee.matrix = new Matrix4(leftBackLegMat);
  leftBackKnee.matrix.translate(0, 0, 1, 0);
  leftBackKnee.matrix.scale(1, 1, 0.15);
  leftBackKnee.render();

  var leftBackLegBottom = new Cube();
  leftBackLegBottom.color = brown;
  leftBackLegBottom.matrix = new Matrix4(leftBackLegMat);
  leftBackLegBottom.matrix.translate(0, 0, 1, 0);
  leftBackLegBottom.matrix.scale(1, 1, 0.75);
  leftBackLegBottom.matrix.rotate(leftBackLegBottomAngle, 1, 0, 0);
  leftBackLegBottom.render();

  var leftBackFoot = new Cube();
  leftBackFoot.color = lightBrown;
  leftBackFoot.matrix = new Matrix4(leftBackLegBottom.matrix);
  leftBackFoot.matrix.translate(0, -0.5, 1);
  leftBackFoot.matrix.scale(1, 1.5, 0.5);
  leftBackFoot.render();

  // right back leg
  var rightBackLegJoint = new Cube();
  rightBackLegJoint.color = brown;
  rightBackLegJoint.matrix = new Matrix4(body.matrix);
  rightBackLegJoint.matrix.translate(0.75, -0.75, 0.75, 0);
  rightBackLegJoint.matrix.scale(0.25, 0.1, 0.25);
  rightBackLegJoint.render();

  var rightBackLegTop = new Cube();
  rightBackLegTop.color = brown;
  rightBackLegTop.matrix = new Matrix4(body.matrix);
  var rightBackLegMat = rightBackLegTop.matrix;
  rightBackLegTop.matrix.translate(0.75, -0.5, 0.75, 0);
  rightBackLegTop.matrix.scale(1, 0.75, 1);
  rightBackLegTop.matrix.scale(0.25, 0.75, 0.25);
  rightBackLegTop.matrix.rotate(rightBackLegTopAngle, 1, 0, 0);
  rightBackLegTop.matrix.rotate(90, 1, 0, 0);
  rightBackLegTop.render();

  var rightBackKnee = new Cube();
  rightBackKnee.color = brown;
  rightBackKnee.matrix = new Matrix4(rightBackLegMat);
  rightBackKnee.matrix.translate(0, 0, 1, 0);
  rightBackKnee.matrix.scale(1, 1, 0.15);
  rightBackKnee.render();

  var rightBackLegBottom = new Cube();
  rightBackLegBottom.color = brown;
  rightBackLegBottom.matrix = new Matrix4(rightBackLegMat);
  rightBackLegBottom.matrix.translate(0, 0, 1, 0);
  rightBackLegBottom.matrix.scale(1, 1, 0.75);
  rightBackLegBottom.matrix.rotate(rightBackLegBottomAngle, 1, 0, 0);
  rightBackLegBottom.render();

  var rightBackFoot = new Cube();
  rightBackFoot.color = lightBrown;
  rightBackFoot.matrix = new Matrix4(rightBackLegBottom.matrix);
  rightBackFoot.matrix.translate(0, -0.5, 1);
  rightBackFoot.matrix.scale(1, 1.5, 0.5);
  rightBackFoot.render();


  // tail
  var tailBottom = new Cube();
  tailBottom.color = brown;
  tailBottom.matrix = new Matrix4();
  tailBottom.matrix.translate(0, dogY, 0);
  tailBottom.matrix.translate(-0.05, 0, 0.575);
  tailBottom.matrix.rotate(tailFrontAngle, 1, 0, 0);  // front and back
  tailBottom.matrix.rotate(-tailLeftAngle, 0, 0, 1);  // left and right
  tailBottom.matrix.scale(0.1, 0.3, 0.1);
  tailBottom.render();

  var tailTop = new Cube();
  tailTop.color = lightBrown;
  tailTop.matrix = new Matrix4(tailBottom.matrix);
  tailTop.matrix.translate(0, 1, 0);
  tailTop.matrix.scale(1, 0.5, 1);
  tailTop.render();

  if (dogSad) {
    var leftEyebrow = new Cube();
    leftEyebrow.color = black;
    leftEyebrow.matrix = new Matrix4(face.matrix);
    leftEyebrow.matrix.translate(0, 0.9, -0.3, 0);
    leftEyebrow.matrix.rotate(-75, 0, 0, 1);
    leftEyebrow.matrix.scale(0.1, 0.5, 0.1)
    leftEyebrow.render();

    var rightEyebrow = new Cube();
    rightEyebrow.color = black;
    rightEyebrow.matrix = new Matrix4(face.matrix);
    rightEyebrow.matrix.translate(1, 0.8, -0.3, 0);
    rightEyebrow.matrix.rotate(75, 0, 0, 1);
    rightEyebrow.matrix.scale(0.1, 0.5, 0.1)
    rightEyebrow.render();
  }


  // Check the time at the end of the function, and show on web page
  var duration = performance.now() - startTime;
  sendTextToHTML(' ms: ' + Math.floor(duration) + ' fps: ' + Math.floor(10000 / duration), 'numdot');
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


// Globals related UI elements
let g_animateAngle = 0;
let g_animation = true;

let headAngle = 0;
let openMouth = 0;
let leftFrontLegTopAngle = 0;
let leftFrontLegBottomAngle = 0;
let rightFrontLegTopAngle = 0;
let rightFrontLegBottomAngle = 0;
let leftBackLegTopAngle = 0;
let leftBackLegBottomAngle = 0;
let rightBackLegTopAngle = 0;
let rightBackLegBottomAngle = 0;

let tailFrontAngle = 0;
let tailLeftAngle = 0;

let leftEyeX = 0; // (-0.25, 0.25)
let leftEyeY = 0; // (0, 0.5)

let rightEyeX = 0; // (-0.25, 0.25)
let rightEyeY = 0; // (0, 0.5)

let leftEyeClose = 1.0; // 1.00 - 5.00
let rightEyeClose = 1.0; // 1.00 - 5.00

let followCursor = true;

// Set up actions for the HTML UI elements
function addActionsForHtmlUI() {
  // Slider Events
  document.getElementById('headSlide').addEventListener('mousemove', function () {
    headAngle = this.value;
    renderAllShapes();
  });

  document.getElementById('mouthSlide').addEventListener('mousemove', function () {
    openMouth = this.value / 100;
    renderAllShapes();
  });

  document.getElementById('tailLRSlide').addEventListener('mousemove', function () {
    tailLeftAngle = this.value;
    renderAllShapes();
  });

  document.getElementById('tailFBSlide').addEventListener('mousemove', function () {
    tailFrontAngle = this.value;
    renderAllShapes();
  });

  document.getElementById('leftEyeCloseSlide').addEventListener('mousemove', function () {
    leftEyeClose = 6 - this.value / 10;
    renderAllShapes();
  });

  document.getElementById('leftEyeUDSlide').addEventListener('mousemove', function () {
    leftEyeY = this.value / 100;
    renderAllShapes();
  });

  document.getElementById('leftEyeLRSlide').addEventListener('mousemove', function () {
    leftEyeX = this.value / 100;
    renderAllShapes();
  });

  document.getElementById('rightEyeCloseSlide').addEventListener('mousemove', function () {
    rightEyeClose = 6 - this.value / 10;
    renderAllShapes();
  });

  document.getElementById('rightEyeUDSlide').addEventListener('mousemove', function () {
    rightEyeY = this.value / 100;
    renderAllShapes();
  });

  document.getElementById('rightEyeLRSlide').addEventListener('mousemove', function () {
    rightEyeX = this.value / 100;
    renderAllShapes();
  });

  document.getElementById('leftFrontLegTopSlide').addEventListener('mousemove', function () {
    leftFrontLegTopAngle = this.value;
    renderAllShapes();
  });
  document.getElementById('leftFrontLegBottomSlide').addEventListener('mousemove', function () {
    leftFrontLegBottomAngle = this.value;
    renderAllShapes();
  });

  document.getElementById('leftBackLegTopSlide').addEventListener('mousemove', function () {
    leftBackLegTopAngle = this.value;
    renderAllShapes();
  });
  document.getElementById('leftBackLegBottomSlide').addEventListener('mousemove', function () {
    leftBackLegBottomAngle = this.value;
    renderAllShapes();
  });

  document.getElementById('rightFrontLegTopSlide').addEventListener('mousemove', function () {
    rightFrontLegTopAngle = this.value;
    renderAllShapes();
  });
  document.getElementById('rightFrontLegBottomSlide').addEventListener('mousemove', function () {
    rightFrontLegBottomAngle = this.value;
    renderAllShapes();
  });

  document.getElementById('rightBackLegTopSlide').addEventListener('mousemove', function () {
    rightBackLegTopAngle = this.value;
    renderAllShapes();
  });
  document.getElementById('rightBackLegBottomSlide').addEventListener('mousemove', function () {
    rightBackLegBottomAngle = this.value;
    renderAllShapes();
  });

  // Button Events
  document.getElementById('animationOnButton').onclick = function () {
    if (!g_animation) {
      g_startTime = performance.now() / 1000.0;
    }
    g_animation = true;
  };

  document.getElementById('animationOffButton').onclick = function () {
    g_animation = false;
  };
  document.getElementById('followOnButton').onclick = function () {
    followCursor = true;
  };
  document.getElementById('followOffButton').onclick = function () {
    followCursor = false;
  };
}

function updateSlider() {
  // document.getElementById('yellowSlide').value = g_yellowAngle;
  if (g_animation) {
    document.getElementById('tailLRSlide').value = tailLeftAngle;
    document.getElementById('tailFBSlide').value = tailFrontAngle;
    document.getElementById('leftFrontLegTopSlide').value = leftFrontLegTopAngle;
    document.getElementById('leftFrontLegBottomSlide').value = leftFrontLegBottomAngle;
    document.getElementById('leftBackLegTopSlide').value = leftBackLegTopAngle;
    document.getElementById('leftBackLegBottomSlide').value = leftBackLegBottomAngle;
    document.getElementById('rightFrontLegTopSlide').value = rightFrontLegTopAngle;
    document.getElementById('rightFrontLegBottomSlide').value = rightFrontLegBottomAngle;
    document.getElementById('rightBackLegTopSlide').value = rightBackLegTopAngle;
    document.getElementById('rightBackLegBottomSlide').value = rightBackLegBottomAngle;
  }
  if (followCursor) {
    document.getElementById('leftEyeUDSlide').value = leftEyeY * 100;
    document.getElementById('leftEyeLRSlide').value = leftEyeX * 100;
    document.getElementById('rightEyeUDSlide').value = rightEyeY * 100;
    document.getElementById('rightEyeLRSlide').value = rightEyeX * 100;
  }
}

var g_startTime = performance.now() / 500.0;
var g_seconds = performance.now() / 500.0 - g_startTime;

// called by browser repeatedly whenever its time
function tick() {
  // print some debug information so we know it's running
  g_seconds = performance.now() / 500.0 - g_startTime;

  // update animation angles
  updateAnimationAngles();

  // draw everything
  renderAllShapes();

  // tell the browser to update again when it has time
  requestAnimationFrame(tick);
}

let dogY = 0;
let dogSad = false;
let poked = false;
function poke() {
  g_animation = false;
  followCursor = false;
  dogY = 0.25;
  openMouth = 0;
  leftEyeX = 0;
  rightEyeX = 0;
  leftEyeY = 0.25;
  rightEyeY = 0.25;
  poked = true;
  setTimeout(function () {
    dogY = -0.25;
    dogSad = !dogSad;
    openMouth = -0.15;
    leftFrontLegTopAngle = -90;
    leftBackLegTopAngle = -90;
    rightFrontLegTopAngle = -90;
    rightBackLegTopAngle = -90;
    leftEyeClose = 2.5;
    rightEyeClose = 2.5;
    tailFrontAngle = 90;
  }, 500)
  setTimeout(function () {
    dogY = 0;
    leftEyeClose = 1;
    rightEyeClose = 1;
    if (!dogSad) {
      openMouth = 0;
    }
    g_animation = true;
    followCursor = true;
    poked = false;
  }, 3000);
}


function main() {
  setUpWebGL();
  connectVariablesToGLSL();

  // Set up action for the HTML elements
  addActionsForHtmlUI()


  // Move camera
  canvas.onmousemove = function (e) {
    mouseX = e.x;
    mouseY = e.y;
    if (e.buttons == 1) {
      var moveX = e.movementX;
      var moveY = e.movementY;
      cameraX += moveX;
      cameraY += moveY;
    }
  }

  canvas.onclick = function (e) {
    if (e.shiftKey) {
      if (!poked) {
        poke();
      }
    }
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  // renderAllShapes();
  requestAnimationFrame(tick);
}

