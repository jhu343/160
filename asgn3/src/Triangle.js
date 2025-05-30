class Triangle{
  constructor() {
    this.type = 'triangle';
    this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.size = 10.0;
  }

  render () {
    var xy = this.position;
    var rgba = this.color;
    var size = this.size;

    // Pass the color of a triangle to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Pass the size of a triangle to u_Size variable
    gl.uniform1f(u_Size, size);

    // Draw
    var d = this.size / 200.0;  // delta
    drawTriangle([xy[0], xy[1], xy[0] + d * cosB, xy[1] - d * sinB, xy[0] + d*sinB, xy[1] + d * cosB]);
  }
};

var g_vertexBuffer = null;
function initTriangle3D() {
  g_vertexBuffer = gl.createBuffer();
  if (!g_vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

}

function drawTriangle(vertices) {
  var n = 3; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function drawTriangle3D(vertices) {
  // var n = 3; // The number of vertices
  var n = vertices.length / 3;

  if (g_vertexBuffer == null) {
    initTriangle3D();
  }

  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  gl.drawArrays(gl.TRIANGLES, 0, n);

  uv_vertexBuffer = null;
  uv_uvBuffer = null;
}

var uv_vertexBuffer = null;
var uv_uvBuffer = null;
function initTriangle3DUV_vertex() {
  // Create a buffer object for vertices
  uv_vertexBuffer = gl.createBuffer();
  if (!uv_vertexBuffer) {
    console.log('Failed to create the vertex buffer object');
    return -1;
  }
  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, uv_vertexBuffer);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);
}

function initTriangle3DUV_uv() {
  // create a buffer object for UV
  uv_uvBuffer = gl.createBuffer();
  if (!uv_uvBuffer) {
    console.log('Failed to create the uv buffer object');
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, uv_uvBuffer);
  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_UV);
}

function drawTriangle3DUV(vertices, uv) {
  var n = vertices.length / 3;
  if (uv_vertexBuffer == null) {
    initTriangle3DUV_vertex();
  }
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

  if (uv_uvBuffer == null) {
    initTriangle3DUV_uv();
  }
  gl.bufferData(gl.ARRAY_BUFFER, uv, gl.DYNAMIC_DRAW);

  // Draw the triangle
  gl.drawArrays(gl.TRIANGLES, 0, n);
  g_vertexBuffer = null;
}
