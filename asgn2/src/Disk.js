class Disk {
  constructor() {
    this.type = 'disk';
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.segments = 36;
    this.matrix = new Matrix4();
  }

  render() {
    var rgba = this.color;
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    const angleStep = 2 * Math.PI / this.segments;
    const radius = 0.5; // You can parameterize this
    const center = [0, 0, 0]; // Center of the disk, in the XY plane

    for (let i = 0; i < this.segments; i++) {
      const angle1 = i * angleStep;
      const angle2 = (i + 1) * angleStep;

      const x1 = center[0] + radius * Math.cos(angle1);
      const y1 = center[1] + radius * Math.sin(angle1);
      const z1 = center[2];

      const x2 = center[0] + radius * Math.cos(angle2);
      const y2 = center[1] + radius * Math.sin(angle2);
      const z2 = center[2];

      drawTriangle3D([
        center[0], center[1], center[2],
        x1, y1, z1,
        x2, y2, z2
      ]);
    }
  }

}