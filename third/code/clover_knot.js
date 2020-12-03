CloverKnot.CloverKnot = function () {
}

CloverKnot.CloverKnot.prototype.init = function () {

    this._radius = CloverKnot.tileSize / 2;

    var geometry = new THREE.TorusKnotGeometry(22, 5, 80, 10);
    var meshMaterial = new THREE.MeshPhongMaterial( {
        polygonOffset: true,  // will make sure the edges are visible.
        polygonOffsetUnits: 1,
        polygonOffsetFactor: 1,
        color: "white",
        specular: 0x202020,
        transparent: true,
        opacity: 0.9
    });
    this._knotMesh = new THREE.Mesh(geometry, meshMaterial);
    this._knotMesh.position.y = this._radius;

    this._knotMesh.matrixAutoUpdate = false;
    this._knotMesh.updateMatrix();

    // build this._mesh
    this._mesh = new THREE.Object3D();
    this._mesh.addChild(this._knotMesh);

    this._speedVector = new THREE.Vector3(0, 0, 0);
    this._friction = 0.888;
}

CloverKnot.CloverKnot.prototype.mesh = function () {
    return this._mesh;
}


CloverKnot.CloverKnot.prototype.tick = function () {
    // apply friction
    this._speedVector.multiplyScalar(this._friction);
    // apply speed
    this._mesh.position.addSelf(this._speedVector);

    var perimeter = 2 * Math.PI * this._radius;
    var rotationZ = -4 * this._speedVector.x / perimeter;
    var rotationX = +4 * this._speedVector.z / perimeter;

    var mesh = this._knotMesh;

    // solution to get rolling figure from |3d| on freenode
    var matrix = new THREE.Matrix4().setTranslation(0, this._radius, 0);
    matrix.multiplySelf(new THREE.Matrix4().setRotationX(rotationX));
    matrix.multiplySelf(new THREE.Matrix4().setRotationZ(rotationZ));
    matrix.multiplySelf(new THREE.Matrix4().setTranslation(0, -this._radius, 0));
    mesh.matrix.copy(matrix.multiplySelf(mesh.matrix));

    mesh.update(false, true, camera);
}
