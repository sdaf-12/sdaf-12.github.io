import * as THREE from './three.module.js';
import {DeviceOrientationControls} from './DeviceOrientationControls.js';

///vars
let camera, scene, renderer, controls;

///run
init();
animate();

///main flow
function init() {
    ///scene camera
    const overlay = document.getElementById('lab3-cont');
    overlay.remove();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 120, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 6;
    ///adjuster
    function adjustToLimit(v) {
        if (v > 1) {
            return (v * -1) / 3.6;
        }
        return v;
    }
    ///figure
    var kiss = function (u, v, vector) {
        u *= 2 * Math.PI;
        v *= 4;
        v = adjustToLimit(v);

        var x = 1.25 * v * v * Math.sqrt(1 - v) * Math.cos(u);
        var y = 1.25 * v * v * Math.sqrt(1 - v) * Math.sin(u);
        var z = 2 * v;

        vector.set(x, y, z);
    };
    ///geom
    var my_geometry = new THREE.ParametricGeometry(kiss, 200, 200);
    var my_material = new THREE.MeshBasicMaterial({
        color: 0xff00ff,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
    });
    ///render
    var surface = new THREE.Mesh(my_geometry, my_material);
    scene.add(surface);
    controls = new DeviceOrientationControls(surface);
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);
}
///update flow
function animate() {
    window.requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
///resize flow
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}