function sin(x) {
    return Math.sin(x);
}

function cos(x) {
    return Math.cos(x);
}

class Sphere {
	constructor() {
		this.type = 'sphere';
		this.color = [1.0, 1.0, 1.0, 1.0];
		this.matrix = new Matrix4();
		this.textureNum = -2;
        this.verts32 = new Float32Array([]);
	};

	render() {
		var rgba = this.color;
		gl.uniform1i(u_whichTexture, this.textureNum);

		// Pass the color of a triangle to u_FragColor variable
		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
		gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
		
        var d = Math.PI / 10;
        var dd = Math.PI / 10;

        for (var t = 0; t < Math.PI; t += d) {
            for (var r = 0; r < (2 * Math.PI); r += d) {
                var p1 = [sin(t)*cos(r), sin(t)*sin(r), cos(t)];
                var p2 = [sin(t+dd)*cos(r), sin(t+dd)*sin(r), cos(t+dd)];
                var p3 = [sin(t)*cos(r+dd), sin(t)*sin(r+dd), cos(t)];
                var p4 = [sin(t+dd)*cos(r+dd), sin(t+dd)*sin(r+dd), cos(t+dd)];

                var v = [];
                var uv = [];
                v = v.concat(p1); uv = uv.concat([0, 0]);
                v = v.concat(p2); uv = uv.concat([0, 0]);
                v = v.concat(p4); uv = uv.concat([0, 0]);

                gl.uniform4f(u_FragColor, 0, 1, 1, 1);
                // drawTriangle3DUVNormal(new Float32Array(v),new Float32Array(uv),new Float32Array(v));
                drawTriangle3DUVNormal(v, uv, v);

                v = []; uv = [];
                v = v.concat(p1); uv = uv.concat([0, 0]);
                v = v.concat(p4); uv = uv.concat([0, 0]);
                v = v.concat(p3); uv = uv.concat([0, 0]);

                gl.uniform4f(u_FragColor, 0, 1, 1, 1);
                drawTriangle3DUVNormal(v, uv, v);
                // drawTriangle3DUVNormal(new Float32Array(v),new Float32Array(uv),new Float32Array(v));
            
            }
        }




        /*
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
			1, 0, 0,  1, 0, 0,  1, 0, 0,
			1, 0, 0,  1, 0, 0,  1, 0, 0,
			// right
			-1, 0, 0,  -1, 0, 0,  -1, 0, 0,
			-1, 0, 0,  -1, 0, 0,  -1, 0, 0,
			// top
			0, 1, 0,  0, 1, 0,  0, 1, 0,
			0, 1, 0,  0, 1, 0,  0, 1, 0,
			// bottom
			0, -1, 0,  0, -1, 0,  0, -1, 0,
			0, -1, 0,  0, -1, 0,  0, -1, 0,
		]);
		// drawTriangle3DUV(vertices, uvs);
		drawTriangle3DUVNormal(vertices, uvs, normal);
	*/
    }
};