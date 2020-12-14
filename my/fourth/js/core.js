init();
animate();

/**
 * init renderer,camera,scene,light
 */
function init() {
    // create div
    LAB_4.container = document.createElement('div');
    document.body.appendChild(LAB_4.container);

    // init renderer
    LAB_4.renderer = new THREE.WebGLRenderer({
        alpha: true
    });

    // renderer.setClearColor( 0 );  // black background
    // renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
    // renderer.setClearColor(new THREE.Color('blue'), 0);
    LAB_4.renderer.setClearColor(new THREE.Color(0), 0);
    LAB_4.renderer.setSize(window.innerWidth, window.innerHeight);
    LAB_4.renderer.domElement.style.position = 'absolute'
    LAB_4.renderer.domElement.style.top = '0px'
    LAB_4.renderer.domElement.style.left = '0px'
    LAB_4.container.appendChild(LAB_4.renderer.domElement);

    // init scene and camera
    LAB_4.scene = new THREE.Scene();
    LAB_4.camera = new THREE.PerspectiveCamera(28, window.innerWidth / window.innerHeight, 0.1, 100);

    /* Add the camera and a light to the scene, linked into one object. */
    LAB_4.light = new THREE.DirectionalLight();
    LAB_4.light.position.set(0, 0, 1);
    LAB_4.camera.position.set(0, 0, 15);
    LAB_4.camera.lookAt(LAB_4.scene.position);
    LAB_4.camera.add(LAB_4.light);
    LAB_4.scene.add(LAB_4.camera);
}

function animate() {
    let lastTimeMSeconds = null
    requestAnimationFrame(function animate(thisMomentMSeconds) {
        // keep looping
        requestAnimationFrame(animate);
        // measure time
        lastTimeMSeconds = lastTimeMSeconds || thisMomentMSeconds - 1000 / 60
        let deltaMSeconds = Math.min(200, thisMomentMSeconds - lastTimeMSeconds)
        lastTimeMSeconds = thisMomentMSeconds

        /**
         * call update for each function
         */
        LAB_4.callbackFunctionsOnRender.forEach(function (funcOnRender) {
            funcOnRender(deltaMSeconds / 100, thisMomentMSeconds / 100)
        })
    })
}


function actionChangeSizeCallback() {
    LAB_4._libArToolkitSource.onResizeElement()
    LAB_4._libArToolkitSource.copyElementSizeTo(LAB_4.renderer.domElement)
    if (_libArToolkitContext.arController !== null) {
        LAB_4._libArToolkitSource.copyElementSizeTo(_libArToolkitContext.arController.canvas)
    }
}


