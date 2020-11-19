var container;
var devOrientation, world;
var camera, scene, renderer, stats;

init();
animate();

function init() {
    // create div
    container = document.createElement('div');
    document.body.appendChild(container);

    // append WebGL it to the Dom
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    devOrientation = new THREEx.DeviceOrientationState();

    // create the Scene
    scene = new THREE.Scene();

    world = new CloverKnot.World({
        scene: scene
    });

}

// ## Animate and Display the Scene
function animate() {
    // render the 3D scene
    render();
    // relaunch the 'timer'
    requestAnimationFrame(animate);
}


// ## Render the 3D Scene
function render() {

    world.tick();

    // actually display the scene in the Dom element
    renderer.render(scene, world.camera().object());
}
