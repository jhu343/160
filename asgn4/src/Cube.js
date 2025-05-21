class Cube {
	constructor() {
		this.type = 'cube';
		this.color = [1.0, 1.0, 1.0, 1.0];
		this.matrix = new Matrix4();
		// this.normalMatrix = new Matrix4();
		this.textureNum = -1;
		// to apply normal matrix to object:
		// obj.normalMatrix.setInverseOf(obj.matrix).transpose();
	};

	render() {
		var rgba = this.color;
		gl.uniform1i(u_whichTexture, this.textureNum);

		// Pass the color of a triangle to u_FragColor variable
		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
		gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
		

		const vertices = new Float32Array ([
			// Front
			0,0,0,   1,1,0,   1,0,0,
			0,0,0,   0,1,0,   1,1,0,
			// Back
			0,0,1,   1,1,1,   1,0,1,
			0,0,1,   0,1,1,   1,1,1,
			// Left
			0,0,0,   0,1,1,   0,0,1,
			0,0,0,   0,1,0,   0,1,1,
			// Right
			1,0,0,   1,1,1,   1,0,1,
			1,0,0,   1,1,0,   1,1,1,
			// Top
			0,1,0,   1,1,1,   1,1,0,
			0,1,0,   0,1,1,   1,1,1,
			// Bottom
			0,0,0,   1,0,1,   1,0,0,
			0,0,0,   0,0,1,   1,0,1
		]);
		const uvs = new Float32Array ([
			// Front
			0,0,  1,1,  1,0,
			0,0,  0,1,  1,1,
			// Back
			1,0,  0,1,  0,0,
			1,0,  1,1,  0,1,
			// Left
			1,0,  0,1,  0,0,
			1,0,  1,1,  0,1,
			// Right
			0,0,  1,1,  1,0,
			0,0,  0,1,  1,1,
			// Top
			0,0,  1,1,  1,0,
			0,0,  0,1,  1,1,
			// Bottom
			0,1,  1,0,  1,1,
			0,1,  0,0,  1,0
		]);
		const normal = new Float32Array ([
			// front
			0, 0, -1,  0, 0, -1,  0, 0, -1,
			0, 0, -1,  0, 0, -1,  0, 0, -1,
			// back
			0, 0, 1,  0, 0, 1,  0, 0, 1,
			0, 0, 1,  0, 0, 1,  0, 0, 1,
			// left
			-1, 0, 0,  -1, 0, 0,  -1, 0, 0,
			-1, 0, 0,  -1, 0, 0,  -1, 0, 0,
			// right
			1, 0, 0,  1, 0, 0,  1, 0, 0,
			1, 0, 0,  1, 0, 0,  1, 0, 0,
			// top
			0, 1, 0,  0, 1, 0,  0, 1, 0,
			0, 1, 0,  0, 1, 0,  0, 1, 0,
			// bottom
			0, -1, 0,  0, -1, 0,  0, -1, 0,
			0, -1, 0,  0, -1, 0,  0, -1, 0,
		]);
		// drawTriangle3DUV(vertices, uvs);
		drawTriangle3DUVNormal(vertices, uvs, normal);
	}
};