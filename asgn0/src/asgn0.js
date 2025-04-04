// HelloCanvas.js (c) 2012 matsuda
let canvas;
let ctx;

function main() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');
  if (!canvas) {
    console.log('Failed to retrieve the <canvas> element');
    return false;
  }

  // Get the rendering context for 2DCG
  ctx = canvas.getContext('2d');

  // draw a black rectangle
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawVector(v, color) {
  // get x and y value
  let vx = +v.elements[0];
  let vy = +v.elements[1];

  // get center point of the canvas (rectangle)
  let cx = canvas.width / 2;
  let cy = canvas.height / 2;

  // draw the vector
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + vx * 20, cy - vy * 20);
  ctx.stroke();
}

function handleDrawEvent() {
  // clear the canvas (black rectangle)
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // read input to create and draw v1
  let v1x = +document.getElementById('v1x').value;
  let v1y = +document.getElementById('v1y').value;
  let v1 = new Vector3([v1x, v1y, 0]);
  drawVector(v1, 'red');

  // read input to create and draw v2
  let v2x = +document.getElementById('v2x').value;
  let v2y = +document.getElementById('v2y').value;
  let v2 = new Vector3([v2x, v2y, 0]);
  drawVector(v2, 'blue');
}

function handleDrawOperationEvent() {
  // clear the canvas (black rectangle)
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // read input to create and draw v1
  let v1x = +document.getElementById('v1x').value;
  let v1y = +document.getElementById('v1y').value;
  let v1 = new Vector3([v1x, v1y, 0]);
  drawVector(v1, 'red');

  // read input to create and draw v2
  let v2x = +document.getElementById('v2x').value;
  let v2y = +document.getElementById('v2y').value;
  let v2 = new Vector3([v2x, v2y, 0]);
  drawVector(v2, 'blue');

  let op = document.getElementById('operations').value;
  let scalar = document.getElementById('scalar').value;
  switch (op) {
    case 'add':
      v1.add(v2);
      drawVector(v1, 'green');
      break;
    case 'sub':
      v1.sub(v2);
      drawVector(v1, 'green');
      break;
    case 'mul':
      v1.mul(scalar);
      v2.mul(scalar);
      drawVector(v1, 'green');
      drawVector(v2, 'green');
      break;
    case 'div':
      v1.div(scalar);
      v2.div(scalar);
      drawVector(v1, 'green');
      drawVector(v2, 'green');
      break;
    case 'mag':
      let v1m = v1.magnitude();
      let v2m = v2.magnitude();
      console.log('Magnitude v1: ', v1m);
      console.log('Magnitude v2: ', v2m);
      break;
    case 'nor':
      v1.normalize();
      v2.normalize();
      drawVector(v1, 'green');
      drawVector(v2, 'green');
      break;
    case 'angle':
      let a = angleBetween(v1, v2);
      console.log('Angle: ', a);
      break;
    case 'area':
      let area = areaTriangle(v1, v2);
      console.log('Area of the Triangle: ', area);
      break;
  }
}

function angleBetween(v1, v2) {
  let dot = Vector3.dot(v1, v2);
  let m1 = v1.magnitude();
  let m2 = v2.magnitude();
  let a = Math.acos(dot / (m1 * m2)) * (180 / Math.PI);
  return a;
}

function areaTriangle(v1, v2) {
  let cross = Vector3.cross(v1, v2);
  let area = cross.magnitude() / 2;
  return area;
}
