CloverKnot.World = function (opts) {
    this._scene = opts.scene || console.assert(false);
    this._player = new CloverKnot.Figure();
    this._scene.addObject(this._player.mesh());
    this._camera = new CloverKnot.Camera();
}

CloverKnot.World.prototype.player = function () {
    return this._player;
}

CloverKnot.World.prototype.camera = function () {
    return this._camera;
}

CloverKnot.World.prototype.tick = function () {
    this._player.tick();
    this._camera.tick();
}
