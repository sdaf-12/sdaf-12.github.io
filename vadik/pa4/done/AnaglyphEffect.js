THREE.AnaglyphEffect = function (renderer, width, height) {

    var eyeRight = new THREE.Matrix4();
    var eyeLeft = new THREE.Matrix4();
    var focalLength = 125;
    var _aspect, _near, _far, _fov;
    var separation = 30;

    var _cameraL = new THREE.PerspectiveCamera();
    _cameraL.matrixAutoUpdate = false;

    var _cameraR = new THREE.PerspectiveCamera();
    _cameraR.matrixAutoUpdate = false;

    var _camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    var _scene = new THREE.Scene();

    var _params = {minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat};

    if (width === undefined) width = 512;
    if (height === undefined) height = 512;

    var _renderTargetL = new THREE.WebGLRenderTarget(width, height, _params);
    var _renderTargetR = new THREE.WebGLRenderTarget(width, height, _params);

    var _material = new THREE.ShaderMaterial({

        uniforms: {

            "mapLeft": {type: "t", value: _renderTargetL},
            "mapRight": {type: "t", value: _renderTargetR}

        },

        vertexShader: [

            "varying vec2 vUv;",

            "void main() {",

            "	vUv = vec2( uv.x, uv.y );",
            "	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

            "}"

        ].join("\n"),

        fragmentShader: [

            "uniform sampler2D mapLeft;",
            "uniform sampler2D mapRight;",
            "varying vec2 vUv;",

            "void main() {",

            "	vec4 colorL, colorR;",
            "	vec2 uv = vUv;",

            "	colorL = texture2D( mapLeft, uv );",
            "	colorR = texture2D( mapRight, uv );",

            // http://3dtv.at/Knowhow/AnaglyphComparison_en.aspx

            "	gl_FragColor = vec4( colorL.g * 0.7 + colorL.b * 0.3, colorR.g, colorR.b, colorL.a + colorR.a ) * 1.1;",

            "}"

        ].join("\n")

    });

    var mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), _material);
    _scene.add(mesh);

    this.setSize = function (width, height, sep) {

        _renderTargetL = new THREE.WebGLRenderTarget(width, height, _params);
        _renderTargetR = new THREE.WebGLRenderTarget(width, height, _params);

        _material.uniforms["mapLeft"].value = _renderTargetL;
        _material.uniforms["mapRight"].value = _renderTargetR;
        separation = sep;
        renderer.setSize(width, height);

    };


    this.render = function (scene, camera, separat) {

        scene.updateMatrixWorld();

        if (camera.parent === undefined) camera.updateMatrixWorld();

        _aspect = camera.aspect;
        _near = camera.near;
        _far = camera.far;
        _fov = camera.fov;


        var projectionMatrix = camera.projectionMatrix.clone();
        var eyeSep = separat || focalLength / separation * 0.5;
        var eyeSepOnProjection = eyeSep * _near / focalLength;
        var ymax = _near * Math.tan(THREE.Math.degToRad(_fov * 0.5));
        var xmin, xmax;


        eyeRight.elements[12] = eyeSep;
        eyeLeft.elements[12] = -eyeSep;


        xmin = -ymax * _aspect + eyeSepOnProjection;
        xmax = ymax * _aspect + eyeSepOnProjection;

        projectionMatrix.elements[0] = 2 * _near / (xmax - xmin);
        projectionMatrix.elements[8] = (xmax + xmin) / (xmax - xmin);

        _cameraL.projectionMatrix.copy(projectionMatrix);


        xmin = -ymax * _aspect - eyeSepOnProjection;
        xmax = ymax * _aspect - eyeSepOnProjection;

        projectionMatrix.elements[0] = 2 * _near / (xmax - xmin);
        projectionMatrix.elements[8] = (xmax + xmin) / (xmax - xmin);

        _cameraR.projectionMatrix.copy(projectionMatrix);


        _cameraL.matrixWorld.copy(camera.matrixWorld).multiply(eyeLeft);
        _cameraL.position.copy(camera.position);
        _cameraL.near = camera.near;
        _cameraL.far = camera.far;

        renderer.render(scene, _cameraL, _renderTargetL, true);

        _cameraR.matrixWorld.copy(camera.matrixWorld).multiply(eyeRight);
        _cameraR.position.copy(camera.position);
        _cameraR.near = camera.near;
        _cameraR.far = camera.far;

        renderer.render(scene, _cameraR, _renderTargetR, true);

        renderer.render(_scene, _camera);

    };

};
