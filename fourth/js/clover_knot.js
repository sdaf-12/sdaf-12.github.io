/**
 * parametric geometry definition
 * @param u
 * @param v
 * @param target
 */
let knot = function (u, v, target) {
    u *= 12 * Math.PI;
    v *= 2 * Math.PI;

    let R = 2;
    let a = 0.5;

    let x = (R + a * Math.cos(u / 2)) *
        Math.cos(u / 3) +
        a * Math.cos(u / 3) *
        Math.cos(v - Math.PI);

    let y = (R + a * Math.cos(u / 2)) *
        Math.sin(u / 3) +
        a * Math.sin(u / 3) *
        Math.cos(v - Math.PI);

    let z = a + Math.sin(u / 2) +
        a * Math.sin(v - Math.PI);

    target.set(x, y, z);
};

/**
 * Create and add the transparent cnot_fig to the scene
 * @type {Mesh}
 */
LAB_4.knot_fig = new THREE.Mesh(
    new THREE.ParametricGeometry(knot, 120, 120, false),
    new THREE.MeshPhongMaterial({
        polygonOffset: true,  // will make sure the edges are visible.
        polygonOffsetUnits: 1,
        polygonOffsetFactor: 1,
        color: "white",
        specular: 0x202020,
        transparent: true,
        opacity: 0.9
    })
);
LAB_4.arWorldRootElement.add(LAB_4.knot_fig);

LAB_4.callbackFunctionsOnRender.push(function () {
    LAB_4.knot_fig.rotation.x += CONSTANTS.SPEED_STEP;
});
LAB_4.callbackFunctionsOnRender.push(function () {
    LAB_4.renderer.render(LAB_4.scene, LAB_4.camera);
});
