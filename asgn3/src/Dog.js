let dogX = 4;
let dogY = 0;
let dogZ = 11;

function renderDog() {
    // color
    const brown = [0.627, 0.322, 0.176, 1.0];
    const lightBrown = [0.87, 0.72, 0.53, 1.0];
    const darkBrown = [0.227, 0.149, 0.149, 1.0];
    const red = [0.65, 0.08, 0.08, 1.0];
    const white = [1, 1, 1, 1];
    const black = [0, 0, 0, 1];

    var temp = new Cube();
    temp.textureNum = -2;
  
    // Draw animal
    // Head --------------------
    var face = new Cube();
    face.color = brown;
    face.textureNum = -2;
    face.matrix.translate(dogX, dogY, dogZ);
    face.matrix.translate(-0.175, -0.175, -0.175);
    face.matrix.scale(0.35, 0.35, 0.35);
    face.render();
  
    // nose
    temp.color = brown;
    temp.matrix = new Matrix4(face.matrix);
    temp.matrix.translate(0, 0, -0.5);
    temp.matrix.scale(1, 0.5, 0.5);
    temp.render();
  
    // nose tip
    temp.color = darkBrown;
    temp.matrix = new Matrix4(face.matrix);
    temp.matrix.translate(0.35, 0, -0.65);
    temp.matrix.scale(0.35, 0.25, 0.15);
    temp.render();
  
    // mouth
    temp.color = lightBrown;
    temp.matrix = new Matrix4(face.matrix);
    temp.matrix.translate(0, -0.5, 0);
    temp.matrix.scale(1, 0.5, 0.5);
    temp.render();
  
    // upper Lip
    temp.color = lightBrown;
    temp.matrix = new Matrix4(face.matrix);
    temp.matrix.translate(0, -0.25, -0.5);
    temp.matrix.scale(1, 0.25, 0.5);
    temp.render();
  
    // lower lip
    temp.color = lightBrown;
    temp.matrix = new Matrix4(face.matrix);
    temp.matrix.translate(0, -0.5, -0.25);
    temp.matrix.scale(1, 0.125, 0.25);
    temp.render();
  
    // tongue
    temp.color = red;
    temp.matrix = new Matrix4(face.matrix);
    temp.matrix.translate(0.25, -0.375, -0.25);
    temp.matrix.scale(0.5, 0.125, 0.25);
    temp.render();
  
    // between eyes
    temp.color = brown;
    temp.matrix = new Matrix4(face.matrix);
    temp.matrix.translate(0.45, 0.5, -0.1, 0);
    temp.matrix.scale(0.1, 0.5, 0.1);
    temp.render();
  
    // left eye lid top
    var leftEyeLidTop = new Cube();
    leftEyeLidTop.textureNum = -2;
    leftEyeLidTop.color = brown;
    leftEyeLidTop.matrix = new Matrix4(face.matrix);
    leftEyeLidTop.matrix.translate(0.1, 0.9, -0.1, 0);
    leftEyeLidTop.matrix.scale(0.35, 0.1, 0.1)
    leftEyeLidTop.render();
  
    // left eye lid side
    temp.color = brown;
    temp.matrix = new Matrix4(face.matrix);
    temp.matrix.translate(0, 0.5, -0.1, 0);
    temp.matrix.scale(0.1, 0.5, 0.1)
    temp.render();
  
    // left eye lid
    temp.color = brown;
    temp.matrix = new Matrix4(leftEyeLidTop.matrix);
    temp.matrix.translate(1, 1, 0, 0);
    // temp.matrix.scale(1, leftEyeClose, 1);
    temp.matrix.translate(-1, -1, -1, 0);
    temp.render();
  
    // left eye white
    var leftEyewhite = new Cube();
    leftEyewhite.textureNum = -2;
    leftEyewhite.color = white;
    leftEyewhite.matrix = new Matrix4(face.matrix);
    leftEyewhite.matrix.translate(0.1, 0.5, -0.1, 0);
    leftEyewhite.matrix.scale(0.35, 0.4, 0.1);
    leftEyewhite.render();
  
    // left eye
    temp.color = black;
    temp.matrix = new Matrix4(leftEyewhite.matrix);
    // temp.matrix.translate(leftEyeX, leftEyeY, 0);
    temp.matrix.translate(0.25, 0, -0.5);
    temp.matrix.scale(0.55, 0.5, 0.5);
    temp.render();
  
    // right eye white
    var rightEyewhite = new Cube();
    rightEyewhite.textureNum = -2;
    rightEyewhite.color = white;
    rightEyewhite.matrix = new Matrix4(face.matrix);
    rightEyewhite.matrix.translate(0.55, 0.5, -0.1, 0);
    rightEyewhite.matrix.scale(0.35, 0.4, 0.1);
    rightEyewhite.render();
  
    // right eye lid top
    var rightEyeLidTop = new Cube();
    rightEyeLidTop.textureNum = -2;
    rightEyeLidTop.color = brown;
    rightEyeLidTop.matrix = new Matrix4(face.matrix);
    rightEyeLidTop.matrix.translate(0.55, 0.9, -0.1, 0);
    rightEyeLidTop.matrix.scale(0.35, 0.1, 0.1)
    rightEyeLidTop.render();
  
    // right eye lid side
    temp.color = brown;
    temp.matrix = new Matrix4(face.matrix);
    temp.matrix.translate(0.9, 0.5, -0.1, 0);
    temp.matrix.scale(0.1, 0.5, 0.1)
    temp.render();
  
    // right eye lid
    temp.color = brown;
    temp.matrix = new Matrix4(rightEyeLidTop.matrix);
    temp.matrix.translate(1, 1, 0, 0);
    // temp.matrix.scale(1, rightEyeClose, 1);
    temp.matrix.translate(-1, -1, -1, 0);
    temp.render();

    // right eye
    temp.color = black;
    temp.matrix = new Matrix4(rightEyewhite.matrix);
    // temp.matrix.translate(rightEyeX, rightEyeY, 0);
    temp.matrix.translate(0.25, 0, -0.5);
    temp.matrix.scale(0.55, 0.5, 0.5);
    temp.render();
  
    // ears --------------------
    // left ear bottom
    temp.color = brown;
    temp.matrix = new Matrix4(face.matrix);
    temp.matrix.translate(-0.1, 0.8, 0);
    temp.matrix.scale(0.3, 0.45, 0.25);
    temp.render();

    // left ear top
    temp.color = darkBrown;
    temp.matrix = new Matrix4(face.matrix);
    temp.matrix.translate(-0.1, 1, -0.125);
    temp.matrix.scale(0.3, 0.25, 0.125);
    temp.render();
  
    // right ear bottom
    temp.color = brown;
    temp.matrix = new Matrix4(face.matrix);
    temp.matrix.translate(0.8, 0.8, 0);
    temp.matrix.scale(0.3, 0.45, 0.25);
    temp.render();
  
    // right ear top
    temp.color = darkBrown;
    temp.matrix = new Matrix4(face.matrix);
    temp.matrix.translate(0.8, 1, -0.125);
    temp.matrix.scale(0.3, 0.25, 0.125);
    temp.render();
  
    // Body --------------------
    var body = new Cube();
    body.textureNum = -2;
    body.color = brown;
    body.matrix.translate(dogX, dogY, dogZ);
    body.matrix.translate(-0.175, -0.175, 0.175);
    body.matrix.scale(0.35, 0.25, 0.5);
    body.render();
  
    // lower body
    temp.color = brown;
    temp.matrix = new Matrix4(body.matrix);
    temp.matrix.translate(0, -0.7, -0.35, 0);
    temp.matrix.scale(1, 0.7, 1.35);
    temp.render();
  
    // Legs --------------------
    // left front leg
    // left front leg joint
    temp.color = brown;
    temp.matrix = new Matrix4(body.matrix);
    temp.matrix.translate(0, -0.75, -0.35, 0);
    temp.matrix.scale(0.25, 0.1, 0.25);
    temp.render();
  
    // left front leg top
    temp.color = brown;
    temp.matrix = new Matrix4(body.matrix);
    var leftFrontLegMat = temp.matrix;
    temp.matrix.translate(0, -0.5, -0.35, 0);
    temp.matrix.scale(1, 0.75, 1);
    temp.matrix.scale(0.25, 0.75, 0.25);
    // temp.matrix.rotate(leftFrontLegTopAngle, 1, 0, 0);
    temp.matrix.rotate(90, 1, 0, 0);
    temp.render();
  
    // left front knee
    temp.color = brown;
    temp.matrix = new Matrix4(leftFrontLegMat);
    temp.matrix.translate(0, 0, 1, 0);
    temp.matrix.scale(1, 1, 0.15);
    temp.render();
  
    // left front leg bottom
    temp.color = brown;
    temp.matrix = new Matrix4(leftFrontLegMat);
    var leftFrontLegBottomMat = temp.matrix;
    temp.matrix.translate(0, 0, 1, 0);
    temp.matrix.scale(1, 1, 0.75);
    // temp.matrix.rotate(leftFrontLegBottomAngle, 1, 0, 0);
    temp.render();
  
    // left front foot
    temp.color = lightBrown;
    temp.matrix = new Matrix4(leftFrontLegBottomMat);
    temp.matrix.translate(0, -0.5, 1);
    temp.matrix.scale(1, 1.5, 0.5);
    temp.render();
  
    // right front leg
    // right fron tleg joint
    temp.color = brown;
    temp.matrix = new Matrix4(body.matrix);
    temp.matrix.translate(0.75, -0.75, -0.35, 0);
    temp.matrix.scale(0.25, 0.1, 0.25);
    temp.render();
  
    // right front leg top
    temp.color = brown;
    temp.matrix = new Matrix4(body.matrix);
    var rightFrontLegMat = temp.matrix;
    temp.matrix.translate(0.75, -0.5, -0.35, 0);
    temp.matrix.scale(1, 0.75, 1);
    temp.matrix.scale(0.25, 0.75, 0.25);
    // temp.matrix.rotate(rightFrontLegTopAngle, 1, 0, 0);
    temp.matrix.rotate(90, 1, 0, 0);
    temp.render();
  
    // right front knee
    temp.color = brown;
    temp.matrix = new Matrix4(rightFrontLegMat);
    temp.matrix.translate(0, 0, 1, 0);
    temp.matrix.scale(1, 1, 0.15);
    temp.render();
  
    // right front leg bottom
    var rightFrontLegBottom = new Cube();
    rightFrontLegBottom.textureNum = -2;
    rightFrontLegBottom.color = brown;
    rightFrontLegBottom.matrix = new Matrix4(rightFrontLegMat);
    rightFrontLegBottom.matrix.translate(0, 0, 1, 0);
    rightFrontLegBottom.matrix.scale(1, 1, 0.75);
    // rightFrontLegBottom.matrix.rotate(rightFrontLegBottomAngle, 1, 0, 0);
    rightFrontLegBottom.render();
  
    // right front foot
    temp.color = lightBrown;
    temp.matrix = new Matrix4(rightFrontLegBottom.matrix);
    temp.matrix.translate(0, -0.5, 1);
    temp.matrix.scale(1, 1.5, 0.5);
    temp.render();
  
    // left back leg
    // left back leg joint
    temp.color = brown;
    temp.matrix = new Matrix4(body.matrix);
    temp.matrix.translate(0, -0.75, 0.75, 0);
    temp.matrix.scale(0.25, 0.1, 0.25);
    temp.render();
  
    // left back leg top
    temp.color = brown;
    temp.matrix = new Matrix4(body.matrix);
    var leftBackLegMat = temp.matrix;
    temp.matrix.translate(0, -0.5, 0.75, 0);
    temp.matrix.scale(1, 0.75, 1);
    temp.matrix.scale(0.25, 0.75, 0.25);
    // temp.matrix.rotate(leftBackLegTopAngle, 1, 0, 0);
    temp.matrix.rotate(90, 1, 0, 0);
    temp.render();
  
    // left back knee
    temp.color = brown;
    temp.matrix = new Matrix4(leftBackLegMat);
    temp.matrix.translate(0, 0, 1, 0);
    temp.matrix.scale(1, 1, 0.15);
    temp.render();
  
    // left back leg bottom
    var leftBackLegBottom = new Cube();
    leftBackLegBottom.textureNum = -2;
    leftBackLegBottom.color = brown;
    leftBackLegBottom.matrix = new Matrix4(leftBackLegMat);
    leftBackLegBottom.matrix.translate(0, 0, 1, 0);
    leftBackLegBottom.matrix.scale(1, 1, 0.75);
    // leftBackLegBottom.matrix.rotate(leftBackLegBottomAngle, 1, 0, 0);
    leftBackLegBottom.render();
  
    // left back foot
    temp.color = lightBrown;
    temp.matrix = new Matrix4(leftBackLegBottom.matrix);
    temp.matrix.translate(0, -0.5, 1);
    temp.matrix.scale(1, 1.5, 0.5);
    temp.render();
  
    // right back leg
    // right back leg joint
    temp.color = brown;
    temp.matrix = new Matrix4(body.matrix);
    temp.matrix.translate(0.75, -0.75, 0.75, 0);
    temp.matrix.scale(0.25, 0.1, 0.25);
    temp.render();
  
    // right back leg top
    temp.color = brown;
    temp.matrix = new Matrix4(body.matrix);
    var rightBackLegMat = temp.matrix;
    temp.matrix.translate(0.75, -0.5, 0.75, 0);
    temp.matrix.scale(1, 0.75, 1);
    temp.matrix.scale(0.25, 0.75, 0.25);
    // temp.matrix.rotate(rightBackLegTopAngle, 1, 0, 0);
    temp.matrix.rotate(90, 1, 0, 0);
    temp.render();
  
    // right back knee
    temp.color = brown;
    temp.matrix = new Matrix4(rightBackLegMat);
    temp.matrix.translate(0, 0, 1, 0);
    temp.matrix.scale(1, 1, 0.15);
    temp.render();
  
    // right back leg bottom
    var rightBackLegBottom = new Cube();
    rightBackLegBottom.textureNum = -2;
    rightBackLegBottom.color = brown;
    rightBackLegBottom.matrix = new Matrix4(rightBackLegMat);
    rightBackLegBottom.matrix.translate(0, 0, 1, 0);
    rightBackLegBottom.matrix.scale(1, 1, 0.75);
    // rightBackLegBottom.matrix.rotate(rightBackLegBottomAngle, 1, 0, 0);
    rightBackLegBottom.render();
  
    // right back foot
    temp.color = lightBrown;
    temp.matrix = new Matrix4(rightBackLegBottom.matrix);
    temp.matrix.translate(0, -0.5, 1);
    temp.matrix.scale(1, 1.5, 0.5);
    temp.render();
  
  
    // tail
    var tailBottom = new Cube();
    tailBottom.textureNum = -2;
    tailBottom.color = brown;
    tailBottom.matrix = new Matrix4();
    tailBottom.matrix.translate(dogX, dogY, dogZ);
    tailBottom.matrix.translate(-0.05, 0, 0.575);
    // tailBottom.matrix.rotate(tailFrontAngle, 1, 0, 0);  // front and back
    // tailBottom.matrix.rotate(-tailLeftAngle, 0, 0, 1);  // left and right
    tailBottom.matrix.scale(0.1, 0.3, 0.1);
    tailBottom.render();
  
    // tail top
    temp.color = lightBrown;
    temp.matrix = new Matrix4(tailBottom.matrix);
    temp.matrix.translate(0, 1, 0);
    temp.matrix.scale(1, 0.5, 1);
    temp.render();
  }
