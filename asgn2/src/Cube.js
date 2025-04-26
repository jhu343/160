class Cube{
  constructor() {
    this.type = 'cube';
    // this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    // this.size = 10.0;
    // this.segments = 13;
    this.matrix = new Matrix4();
  };

  render() {
    // var xy = this.position;
    var rgba = this.color;
    // var size = this.size;

    // Pass the color of a triangle to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // Draw
    // front of cube
		drawTriangle3D([0.0, 0.0, 0.0,		1.0, 1.0, 0.0,		1.0, 0.0, 0.0]);
		drawTriangle3D([0.0, 0.0, 0.0,		0.0, 1.0, 0.0,		1.0, 1.0, 0.0]);

		// back
		drawTriangle3D([0.0, 0.0, 1.0,		1.0, 1.0, 1.0,		1.0, 0.0, 1.0]);
		drawTriangle3D([0.0, 0.0, 1.0,		0.0, 1.0, 1.0,		1.0, 1.0, 1.0]);

		gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);

		// left
		drawTriangle3D([0.0, 0.0, 0.0,		0.0, 1.0, 1.0,		0.0, 0.0, 1.0]);
		drawTriangle3D([0.0, 0.0, 0.0,		0.0, 1.0, 0.0,		0.0, 1.0, 1.0]);

		// right
		drawTriangle3D([1.0, 0.0, 0.0,		1.0, 1.0, 1.0,		1.0, 0.0, 1.0]);
		drawTriangle3D([1.0, 0.0, 0.0,		1.0, 1.0, 0.0,		1.0, 1.0, 1.0]);

		gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);

		// top
		drawTriangle3D([0.0, 1.0, 0.0,		1.0, 1.0, 1.0,		1.0, 1.0, 0.0]);
		drawTriangle3D([0.0, 1.0, 0.0,		0.0, 1.0, 1.0,		1.0, 1.0, 1.0]);

		// bottom
		drawTriangle3D([0.0, 0.0, 0.0,		1.0, 0.0, 1.0,		1.0, 0.0, 0.0]);
		drawTriangle3D([0.0, 0.0, 0.0,		0.0, 0.0, 1.0,		1.0, 0.0, 1.0]);
  }

};