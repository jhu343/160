import * as THREE from 'three';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';


let canvas;
let renderer;
let scene;
let camera;
let composer;
let controls;


const cubes = [];

const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

let sun;
const planets = [];
const controlParam = {
    bloomOn: true,
    skyOn: true,
    focusObj: null,
};


// texture path
const skyTextures = [
    './images/sky/posX.bmp',
    './images/sky/negX.bmp',
    './images/sky/posY.bmp',
    './images/sky/negY.bmp',
    './images/sky/posZ.bmp',
    './images/sky/negZ.bmp',
];
const sky = cubeTextureLoader.load(skyTextures);

const spaceTexture ='./images/space.jpg';
const sunTexture = './images/sun.jpg';
const mercuryTexture = './images/mercury.jpg';
const venusTexture = './images/venus.jpg';
const earthTexture = './images/earth.jpg';
const marsTexture = './images/mars.jpg';
const jupiterTexture = './images/jupiter.jpg';
const neptuneTexture = './images/neptune.jpg';
const metalTexture = './images/metal.jpg';
const goldTexture = './images/gold.jpg';
const woodTexture = './images/wood2.jpg';

function main() {
    canvas = document.querySelector('#c');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas,
        alpha: true,
        logarithmicDepthBuffer: true,
    });


    // camera
    const fov = 75;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 2000;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 150;
    
    // control
    controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);
    controls.update();

    // scene
    scene = new THREE.Scene();

    /* background */
    // skybox by Chad Wolfe
    // https://opengameart.org/content/sky-box-sunny-day
    // const spaceTexture = cubeTextureLoader.load(spaceTextures);
    // scene.background = spaceTexture;
    scene.background = sky;

    composer = new EffectComposer(renderer);
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1, // strength
        0.5, // radius
        // 1, // threshold
        0.1, // threshold
    );
    composer.setSize(window.innerWidth, window.innerHeight);
    composer.renderToScreen = true;
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(bloomPass);


    /* light */
    const color = 0xFFFFFF;
    const dirLight = new THREE.DirectionalLight(color, 1);
    dirLight.position.set(-1, 2, 4);
    scene.add(dirLight);

    const ambLight = new THREE.AmbientLight(color, 1);
    scene.add(ambLight);

    const pointLight = new THREE.PointLight(color, 10000, 10000);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);


    // gui controller
    const gui = new GUI();
    const cameraFolder = gui.addFolder('Camera');
    cameraFolder.add(camera, 'fov', 1, 180).onChange(updateCamera);
    const minMaxGuiHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
    cameraFolder.add(minMaxGuiHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera);
    cameraFolder.add(minMaxGuiHelper, 'max', 0.1, 2000, 0.1).name('far').onChange(updateCamera);
    cameraFolder.open();
    const controlFolder = gui.addFolder('Focus');
    controlFolder.add(controls.target, 'x', -180, 180).onChange(() => controls.update());
    controlFolder.add(controls.target, 'y', -180, 180).onChange(() => controls.update());
    controlFolder.add(controlParam, 'focusObj', [ 'Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'])
    .name('target').setValue('Sun').
    onChange(
        (value) => {
            controlParam.focusObj = value;
            const index =
                value == 'Sun'? null:
                value == 'Mercury'? 0:
                value == 'Venus'? 1:
                value == 'Earth'? 2:
                value == 'Mars'? 3:
                value == 'Jupiter'? 4:
                value == 'Saturn'? 5:
                value == 'Uranus'? 6:
                value == 'Neptune'? 7:
                null;

            if (index !== null) {
                const dir = new THREE.Vector3();
                const curPos = planets[index].object.getWorldPosition(dir)
                controls.target.set(curPos.x, curPos.y, curPos.z);
                controls.update();
            } else {
                controls.target.set(0,0,0);
                controls.update();
            }
        }
    );
    const lightFolder = gui.addFolder('Light');
    lightFolder.add(dirLight, 'intensity', 0, 10).name('directional').onChange((e) => {dirLight.intensity = e;});
    lightFolder.add(ambLight, 'intensity', 0, 10).name('ambient').onChange((e) => {ambLight.intensity = e;});
    lightFolder.add(pointLight, 'intensity', 0, 50000).name('sun (point light)').onChange((e) => {
        pointLight.intensity = e;
    });
    lightFolder.add(controlParam, 'bloomOn').name('bloom effect').onChange((e) => controlParam.bloomOn = e);
    lightFolder.add(controlParam, 'skyOn').name('daylight').onChange((e) => controlParam.skyOn = e);


    /* objects */
    // table
    const tableGeo = new THREE.BoxGeometry(1000, 20, 1000);
    textureBox(tableGeo, woodTexture, [0, -200, 0]);

    // space box
    const boxGeo = new THREE.BoxGeometry(1000, 1000, 1000);
    transparentTextureBox(boxGeo, spaceTexture, [0, 0, 0], 0.85);


    // cylinders
    const radiusTop = 430;
    const radiusBottom = 450;
    const height = 50;
    const radialSegments = 12;
    const cylinderGeo = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
    textureBox(cylinderGeo, spaceTexture, [0, -180, 0]);

    const smallCylinderGeo = new THREE.CylinderGeometry(5, 5, 200, 6);
    textureBox(smallCylinderGeo, goldTexture, [-400, -160, 400]);
    textureBox(smallCylinderGeo, goldTexture, [400, -160, 400]);
    textureBox(smallCylinderGeo, goldTexture, [-400, -160, -400]);
    textureBox(smallCylinderGeo, goldTexture, [400, -160, -400]);
    
    textureBox(smallCylinderGeo, metalTexture, [200, -160, 200]);
    textureBox(smallCylinderGeo, metalTexture, [0, -160, 300]);
    textureBox(smallCylinderGeo, metalTexture, [-200, -160, 200]);
    textureBox(smallCylinderGeo, metalTexture, [200, -160, -200]);
    textureBox(smallCylinderGeo, metalTexture, [-200, -160, -200]);
    textureBox(smallCylinderGeo, metalTexture, [0, -160, -300]);
    textureBox(smallCylinderGeo, metalTexture, [300, -160, 0]);
    textureBox(smallCylinderGeo, metalTexture, [-300, -160, 0]);

    // textureBox(smallCylinderGeo, metalTexture, [200, -160, 200]);
    // textureBox(smallCylinderGeo, metalTexture, [200, -160, 200]);
    // textureBox(smallCylinderGeo, metalTexture, [200, -160, 200]);
    // textureBox(smallCylinderGeo, metalTexture, [200, -160, 200]);
    // textureBox(smallCylinderGeo, metalTexture, [200, -160, 200]);

    /* Solar System */
    // sun
    const sunGeo = new THREE.SphereGeometry(16, 30, 30);
    const sunMat = new THREE.MeshPhongMaterial({
        map: loadColorTexture(sunTexture),
        emissive: 0xff8800,
        emissiveIntensity: 0.1,
    });
    sun = new THREE.Mesh(sunGeo, sunMat);
    scene.add(sun);
    // planets.push(sun);

    // mercury
    const merGeo = new THREE.SphereGeometry(2.5, 30, 30);
    const mercury = textureSphere(merGeo, mercuryTexture, [30, 5, 5]);
    addRotatingObject(sun, mercury, 0.0005, 0.0001);

    // venus
    const venGeo = new THREE.SphereGeometry(5, 30, 30);
    const venus = textureSphere(venGeo, venusTexture, [60, 0, 10]);
    addRotatingObject(sun, venus, 0.0003, 0.00005);

    // earth
    const earthGeo = new THREE.SphereGeometry(5.2, 30, 30);
    const earth = textureSphere(earthGeo, earthTexture, [90, 5, 0]);
    addRotatingObject(sun, earth, 0.00005, 0.005);

    // moon
    const moonGeo = new THREE.SphereGeometry(0.5, 15, 15);
    const moon = colorSphere(moonGeo, 0xFFFFFF, [100, 5, 0]);
    addRotatingObject(sun, moon, 0.00005, 0.005);

    // mars
    const marsGeo = new THREE.SphereGeometry(3, 30, 30);
    const mars = textureSphere(marsGeo, marsTexture, [140, -5, 5]);
    addRotatingObject(sun, mars, 0.00001, 0.005);


    // jupiter
    const jupGeo = new THREE.SphereGeometry(12, 30, 30);
    const jupiter = textureSphere(jupGeo, jupiterTexture, [160, 10, -5]);
    addRotatingObject(sun, jupiter, 0.000005, 0.01);

    /**
     * Saturn by Zoe XR [CC-BY] (https://creativecommons.org/licenses/by/3.0/)
     * via Poly Pizza (https://poly.pizza/m/2isCiJxCqG4)
     */
    {
        const mtlLoader = new MTLLoader();
        mtlLoader.load('./models/Saturn/materials.mtl', (mtl) => {
            mtl.preload();
            const objLoader = new OBJLoader();
            objLoader.setMaterials(mtl);
            objLoader.load('./models/Saturn/model.obj', (obj) => {
                obj.scale.set(15, 15, 15);
                obj.position.set(200, 5, 5);
                addRotatingObject(sun, obj, 0.0000005, 0.01);
            });
        });
    }


    /**
     * Uranus by Jarlan Perez [CC-BY] (https://creativecommons.org/licenses/by/3.0/) 
     * via Poly Pizza (https://poly.pizza/m/7qZDvQcXQWN)
     */
    {
        const mtlLoader = new MTLLoader();
        mtlLoader.load('./models/Uranus/materials.mtl', (mtl) => {
            mtl.preload();
            const objLoader = new OBJLoader();
            objLoader.setMaterials(mtl);
            objLoader.load('./models/Uranus/model.obj', (obj) => {
                obj.scale.set(30, 30, 30);
                obj.position.set(250, -5, 0);
                addRotatingObject(sun, obj, 0.0000001, 0.003);
            });
        });
    }

    // neptune
    const nepGeo = new THREE.SphereGeometry(7, 30, 30);
    const neptune = textureSphere(nepGeo, neptuneTexture, [280, -5, -10]); // add texture
    addRotatingObject(sun, neptune, 0.00000001, 0.003);


    // render
    composer.render();
    // renderer.render(scene, camera);
    

    requestAnimationFrame(tick);

    console.log('render successfully');
}

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function addRotatingObject(parent, child, orbitSpeed, rotSpeed) {
    const pivot = new THREE.Object3D();
    parent.add(pivot);
    pivot.add(child);
    const obj = {
        object: child, 
        pivot: pivot, 
        orbitSpeed: orbitSpeed, 
        rotSpeed: rotSpeed};
    planets.push(obj);
    return obj;
}

const floatSpeed = 0.05;
const floatAmplitude = 0.2;

function tick(time) {
    time *= 0.001;

    sun.rotateY(0.001);

    // primitive rotation
    cubes.forEach((shape, ndx) => {
        const speed = 1 + ndx * 0.1;
        const rot = time * speed;
        shape.rotation.x = rot;
        shape.rotation.y = rot;
    })


    // planets rotation
    planets.forEach((planet) => {
        planet.pivot.rotation.y += planet.orbitSpeed;
        planet.object.rotation.x += planet.rotSpeed * 0.0001;
        planet.object.rotation.y += planet.rotSpeed;
    });
    if (controlParam.skyOn == true) {
        scene.background = sky;
    } else {
        scene.background = null;
    }
    
    if (controlParam.bloomOn == true) {
        composer.render();
    } else {
        renderer.render(scene, camera);
    }
    requestAnimationFrame(tick);
}

function colorBox(geometry, color, p) {
    const material = new THREE.MeshPhongMaterial({
        color,
        side: THREE.DoubleSide
     });
    const shape = new THREE.Mesh(geometry, material);
    scene.add(shape);
    shape.position.x = p[0];
    shape.position.y = p[1];
    shape.position.z = p[2];
    return shape;
}

function transparentTextureBox(geometry, texture, p, opacity) {
    const material = new THREE.MeshPhongMaterial({
        // color,
        map: loadColorTexture(texture),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: opacity,
     });
    const shape = new THREE.Mesh(geometry, material);
    scene.add(shape);
    shape.position.x = p[0];
    shape.position.y = p[1];
    shape.position.z = p[2];
    return shape;
} 

function textureBox(geometry, texture, p) {
    const material = new THREE.MeshPhongMaterial({ map: loadColorTexture(texture)});
    const shape = new THREE.Mesh(geometry, material);
    scene.add(shape);
    shape.position.x = p[0];
    shape.position.y = p[1];
    shape.position.z = p[2];
    return shape;

}

function multiTextureBox(geometry, textures, p) {
    const materials = [
        new THREE.MeshPhongMaterial({ map: loadColorTexture(textures[0]), side: THREE.BackSide }),
        new THREE.MeshPhongMaterial({ map: loadColorTexture(textures[1]), side: THREE.BackSide }),
        new THREE.MeshPhongMaterial({ map: loadColorTexture(textures[2]), side: THREE.BackSide }),
        new THREE.MeshPhongMaterial({ map: loadColorTexture(textures[3]), side: THREE.BackSide }),
        new THREE.MeshPhongMaterial({ map: loadColorTexture(textures[4]), side: THREE.BackSide }),
        new THREE.MeshPhongMaterial({ map: loadColorTexture(textures[5]), side: THREE.BackSide }),
    ];
    const shape = new THREE.Mesh(geometry, materials);
    shape.position.x = p[0];
    shape.position.y = p[1];
    shape.position.z = p[2];
    return shape;
}

function colorSphere(geometry, color, p) {
    const material = new THREE.MeshPhongMaterial({ color: color });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    sphere.position.x = p[0];
    sphere.position.y = p[1];
    sphere.position.z = p[2];
    return sphere;
}

function textureSphere(geometry, texture, p) {
    const material = new THREE.MeshPhongMaterial({ map: loadColorTexture(texture) });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    sphere.position.x = p[0];
    sphere.position.y = p[1];
    sphere.position.z = p[2];
    return sphere;
}


function loadColorTexture(path) {
    const texture = textureLoader.load(path);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}

function updateCamera() {
    camera.updateProjectionMatrix();
}

function randomGen(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPos(min, max) {
    return [randomGen(min, max), randomGen(min, max), randomGen(min, max)];
}


main();