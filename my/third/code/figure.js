CloverKnot.Figure = function () {
    // call parent class constructor
    this.parent.constructor.call(this);
    this.parent.init.call(this, {
        color: 0xAAAAAA
    });
    this._devOrientationEnable = true;
}

// inherit from methods
CloverKnot.Figure.prototype = new CloverKnot.CloverKnot();
CloverKnot.Figure.prototype.constructor = CloverKnot.CloverKnot;
CloverKnot.Figure.prototype.parent = CloverKnot.CloverKnot.prototype;


/**
 * controls device orientation
 */
CloverKnot.Figure.prototype._adjustAccordingToDeviceOrientation = function () {
    var maxAngleX = 25 * Math.PI / 180;
    var epsilonX = 2 * Math.PI / 180;
    var maxAccelX = 0.5;
    var angleX = devOrientation.angleX();
    angleX = Math.min(+maxAngleX, angleX);
    angleX = Math.max(-maxAngleX, angleX);
    angleX = Math.abs(angleX) < epsilonX ? 0 : angleX;
    this._speedVector.z += maxAccelX * angleX / maxAngleX;

    var maxAngleZ = 25 * Math.PI / 180;
    var epsilonZ = 2 * Math.PI / 180;
    var maxAccelZ = 0.5;
    var angleZ = devOrientation.angleZ();
    angleZ = Math.min(+maxAngleZ, angleZ);
    angleZ = Math.max(-maxAngleZ, angleZ);
    angleZ = Math.abs(angleZ) < epsilonZ ? 0 : angleZ;
    this._speedVector.x += maxAccelZ * angleZ / maxAngleZ;
}

CloverKnot.Figure.prototype.tick = function () {
    if (this._devOrientationEnable) this._adjustAccordingToDeviceOrientation();
    // call the parent class .tick()
    this.parent.tick.call(this);
}
