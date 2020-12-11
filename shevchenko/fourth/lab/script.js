
var renderer = new THREE.WebGLRenderer({
    alpha: true
});
renderer.setClearColor(new THREE.Color('lightgrey'), 0)
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.position = 'absolute'
renderer.domElement.style.top = '0px'
renderer.domElement.style.left = '0px'
document.body.appendChild(renderer.domElement);

var onRenderFcts = [];
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 120, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.z = 6;
scene.add(camera);


var arToolkitSource = new THREEx.ArToolkitSource({
    sourceType: 'webcam',
})

arToolkitSource.init(function onReady() {
    onResize()
})

// handle resize
window.addEventListener('resize', function () {
    onResize()
})


function onResize() {
    arToolkitSource.onResizeElement()
    arToolkitSource.copyElementSizeTo(renderer.domElement)
    if (arToolkitContext.arController !== null) {
        arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas)
    }
}

var arToolkitContext = new THREEx.ArToolkitContext({
    // cameraParametersUrl: THREEx.ArToolkitContext.baseURL + 'data/data/camera_para.par',
    cameraParametersUrl: 'CAMERA/params.dat',
    detectionMode: 'mono',
    maxDetectionRate: 30,
    canvasWidth: 80 * 3,
    canvasHeight: 60 * 3,
})
arToolkitContext.init(function onCompleted() {
    camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
})

onRenderFcts.push(function () {
    if (arToolkitSource.ready === false) return

    arToolkitContext.update(arToolkitSource.domElement)
})


var markerRoot = new THREE.Group
scene.add(markerRoot)
var artoolkitMarker = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
    type: 'pattern',
    patternUrl: 'PATTERN/pattern-pattern2.patt'
})

var smoothedRoot = new THREE.Group()
scene.add(smoothedRoot)
var smoothedControls = new THREEx.ArSmoothedControls(smoothedRoot, {
    lerpPosition: 0.4,
    lerpQuaternion: 0.3,
    lerpScale: 1,
})
onRenderFcts.push(function (delta) {
    smoothedControls.update(markerRoot)
})

var arWorldRoot = smoothedRoot
function adjustToLimit(v) {
    if(v > 1) {
        return (v * -1) / 3.6;
    }
    return v;
}
var kiss = function(u, v, vector) {
    u *= 2 * Math.PI;
    v *= 4;
    v = adjustToLimit(v);

    var x = 1.25*v*v*Math.sqrt(1-v)*Math.cos(u);
    var y = 1.25*v*v*Math.sqrt(1-v)*Math.sin(u);
    var z = 2*v;

    vector.set(x,y,z);
};
var geometry =  new THREE.ParametricGeometry(kiss, 200, 200);
var material = new THREE.MeshBasicMaterial({
    color: 0xff00ff,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide
});
var surface = new THREE.Mesh(geometry, material);
arWorldRoot.add(surface);

onRenderFcts.push(function () {
    renderer.render(scene, camera);
});

var lastTimeMsec = null
requestAnimationFrame(function animate(nowMsec) {
    requestAnimationFrame(animate);
    lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60
    var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
    lastTimeMsec = nowMsec
    onRenderFcts.forEach(function (onRenderFct) {
        onRenderFct(deltaMsec / 1000, nowMsec / 1000)
    })
});