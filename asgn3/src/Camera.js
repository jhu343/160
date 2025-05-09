class Camera {
    constructor() {
        this.eye = new Vector3([-14, 0.5, -13]);
        this.at = new Vector3([-14, 0, 0]);
        this.up = new Vector3([0, 1, 0]);
        this.rotAngle = 2;
    }

    isColliding(newEye, cubeSize = 1) {
        let s = cubeSize / 2;
        for (let cube of cubePosition) {
            if (
                (newEye.elements[0] >= cube.x - s &&
                newEye.elements[0] <= cube.x + s &&
                newEye.elements[1] >= cube.y - s &&
                newEye.elements[1] <= cube.y + s &&
                newEye.elements[2] >= cube.z - s &&
                newEye.elements[2] <= cube.z + s) 
            || newEye.elements[1] < 0  || newEye.elements[1] > 16
            || newEye.elements[0] < -16 || newEye.elements[0] > 16
            || newEye.elements[2] < -16 || newEye.elements[2] > 16
            ) {
                return true;
            }
        }
        return false;
    }

    moveForward() {
        var f = new Vector3().set(this.at);
        f.sub(this.eye);
        f.normalize();

        f.elements[1] = 0;
        f.normalize();

        let newEye = new Vector3().set(this.eye).add(f);

        if (!this.isColliding(newEye)) {
            this.at.add(f);
            this.eye.add(f);
        }
    }

    moveBack() {
        var f = new Vector3().set(this.eye);
        f.sub(this.at);
        f.normalize();

        f.elements[1] = 0;
        f.normalize();

        let newEye = new Vector3().set(this.eye).add(f);
        if (!this.isColliding(newEye)) {
            this.at.add(f);
            this.eye.add(f);
        }
    }

    moveRight() {
        var f = new Vector3().set(this.at);
        f.sub(this.eye);
        f.normalize();
        var s = Vector3.cross(f, this.up);
        s.normalize();

        let newEye = new Vector3().set(this.eye).add(s);
        if (!this.isColliding(newEye)) {
            this.at.add(s);
            this.eye.add(s);
        }
    }

    moveLeft() {
        var f = new Vector3().set(this.eye);
        f.sub(this.at);
        f.normalize();
        var s = Vector3.cross(f, this.up);
        s.normalize();

        let newEye = new Vector3().set(this.eye).add(s);
        if (!this.isColliding(newEye)) {
            this.at.add(s);
            this.eye.add(s);
        }
    }

    moveUp() {
        let newEye = new Vector3().set(this.eye).add(this.up);
        if (!this.isColliding(newEye)) {
            this.eye.add(this.up);
            this.at.add(this.up);
        }
    }

    moveDown() {
        var f = new Vector3([0, -1, 0]);
        let newEye = new Vector3().set(this.eye).add(f);
        if (!this.isColliding(newEye)) {
            this.at.add(f);
            this.eye.add(f);
        }
    }

    panLeft() {
        var f = new Vector3().set(this.at);
        f.sub(this.eye);
        f.normalize();
        var rotMat = new Matrix4();
        rotMat.setRotate(this.rotAngle, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        var f_prime = rotMat.multiplyVector3(f);
        this.at.set(this.eye);
        this.at.add(f_prime);
    }

    panRight() {
        var f = new Vector3().set(this.at);
        f.sub(this.eye);
        f.normalize();
        var rotMat = new Matrix4();
        rotMat.setRotate(-this.rotAngle, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        var f_prime = rotMat.multiplyVector3(f);
        this.at.set(this.eye);
        this.at.add(f_prime);
    }

    panUp() {
        var f = new Vector3().set(this.at);
        f.sub(this.eye);
        f.normalize();
        var s = Vector3.cross(f, this.up);
        s.normalize();
        var rotMat = new Matrix4();
        rotMat.setRotate(this.rotAngle, s.elements[0], s.elements[1], s.elements[2]);
        var f_prime = rotMat.multiplyVector3(f);
        this.at.set(this.eye);
        this.at.add(f_prime);
    }

    panDown() {
        var f = new Vector3().set(this.at);
        f.sub(this.eye);
        f.normalize();
        var s = Vector3.cross(f, this.up);
        s.normalize();
        var rotMat = new Matrix4();
        rotMat.setRotate(-this.rotAngle, s.elements[0], s.elements[1], s.elements[2]);
        var f_prime = rotMat.multiplyVector3(f);
        this.at.set(this.eye);
        this.at.add(f_prime);
    }

    onMove(dx, dy) {
        const sensitivity = 1;
        // horizontal
        if (dx !== 0) {
            const angle = -dx * sensitivity;
            let f = new Vector3().set(this.at).sub(this.eye).normalize();
            let rotMat = new Matrix4().setRotate(angle, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
            let f_prime = rotMat.multiplyVector3(f);
            this.at.set(this.eye).add(f_prime);
        }

        // vertical
        if (dx !== 0) {
            const angle = -dy * sensitivity;
            let f = new Vector3().set(this.at).sub(this.eye).normalize();
            let s = Vector3.cross(f, this.up).normalize();
            let rotMat = new Matrix4().setRotate(angle, s.elements[0], s.elements[1], s.elements[2]);
            let f_prime = rotMat.multiplyVector3(f);
            this.at.set(this.eye).add(f_prime);
        }
    }
}