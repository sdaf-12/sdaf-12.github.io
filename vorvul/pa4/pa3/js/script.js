import * as THREE from '../lib/three.module.js';
import {DeviceOrientationControls} from '../lib/DeviceOrientationControls.js';


var camera;
var scene;
var renderer;
var deviceOrientControls;


var surface;

var pi = Math.PI;
var radius = .5;

var dat_;


//GUI
var datField = function () {
    this.message = "Richmond Minimal Surface";
    this.radius = 0.5;
};

//GUI
window.onload = function () {
    dat_ = new datField();
    setValue();

    // GUI deviceOrientControls...
    var gui = new dat.GUI();
    gui.width = 300;
    gui.add(dat_, "message").name("");
    gui.add(dat_, "radius").min(0).max(1).name("Portion shown").onChange(setValue);
};


function setValue() {
    radius = dat_.radius;
    updateSurface();
}


init();
animate();


/**
 * dat GUI callback
 */
function updateSurface() {//function to initialise and update surf.
    scene.remove(surface);
    var my_geometry = new THREE.ParametricGeometry(richmond, 45, 65);
    var my_material = new THREE.MeshBasicMaterial({
        transparent: true,
        side: THREE.DoubleSide,
        color: 0x888888,
    });

    surface = new THREE.Mesh(my_geometry, my_material);
    deviceOrientControls = new DeviceOrientationControls(surface);
    scene.add(surface);


}


/**
 * Richmond minimal surf
 * @type {number}
 */

function richmond(r, t, vec) {
    var rho = (1 + 3 * radius) * r - 2 - radius;
    var u = Math.exp(rho) * Math.cos(2 * pi * t);
    var v = Math.exp(rho) * Math.sin(2 * pi * t);

    var x = -u / (u * u + v * v) - u * u * u / 3 + u * v * v;
    var y = -v / (u * u + v * v) - u * u * v + v * v * v / 3;
    var z = 2 * u;
    vec.set(y / 4, z / 4, -x / 4);
}


function init() {

    const overlay = document.getElementById('container');
    overlay.remove();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 6;


    // var my_geometry = new THREE.ParametricGeometry(richmond, 200, 200);
    // var my_material = new THREE.MeshBasicMaterial({
    //     color: 0xff00ff,
    //     transparent: true,
    //     opacity: 0.5,
    //     side: THREE.DoubleSide
    // });
    //
    //
    // var surface = new THREE.Mesh(my_geometry, my_material);
    // scene.add(surface);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(new THREE.Color());
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);


}


function animate() {
    window.requestAnimationFrame(animate);
    deviceOrientControls.update();
    renderer.render(scene, camera);
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}