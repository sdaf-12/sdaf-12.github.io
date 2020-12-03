LAB_4._libArToolkitSource = new THREEx.ArToolkitSource({
    displayWidth: window.innerWidth, // 1640,
    displayHeight:  window.innerHeight, // 780,
    sourceType: CONSTANTS.SOURCE_TYPE
});

LAB_4._libArToolkitSource.init(function onReady() {
    actionChangeSizeCallback();
});

window.addEventListener(CONSTANTS.ON_TYPE_RESIZE, function () {
    actionChangeSizeCallback();
});

/**
 * initialize arToolkitContext
 * @type {THREEx.ArToolkitContext}
 */
let _libArToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: CONSTANTS.CAMERA_PARAMETERS_URL,
    detectionMode: 'mono',
    maxDetectionRate: 30,
    canvasWidth: 80 * 3,
    canvasHeight: 60 * 3,
});
_libArToolkitContext.init(function actionCompletedCallback() {
    LAB_4.camera.projectionMatrix.copy(_libArToolkitContext.getProjectionMatrix());
});

// update
LAB_4.callbackFunctionsOnRender.push(function () {
    if (LAB_4._libArToolkitSource.ready === false) {
        return;
    }
    _libArToolkitContext.update(LAB_4._libArToolkitSource.domElement);
});

/**
 *  Create a ArMarkerControls
 * @type {Group}
 */
LAB_4._markerRoot = new THREE.Group;
LAB_4.scene.add(LAB_4._markerRoot);

LAB_4._libArToolkitMarker = new THREEx.ArMarkerControls(_libArToolkitContext, LAB_4._markerRoot, {
    type: 'pattern',
    patternUrl: CONSTANTS.HIRO_PATTERN_PATH
});

// smoothedControls
LAB_4._libArSmoothedRoot = new THREE.Group()
LAB_4.scene.add(LAB_4._libArSmoothedRoot)
LAB_4.smoothedControls = new THREEx.ArSmoothedControls(LAB_4._libArSmoothedRoot, {
    lerpPosition: 0.4,
    lerpQuaternion: 0.3,
    lerpScale: 1,
});
LAB_4.callbackFunctionsOnRender.push(function () {
    LAB_4.smoothedControls.update(LAB_4._markerRoot);
});

//export
LAB_4.arWorldRootElement = LAB_4._libArSmoothedRoot;
