import { getDrawContext } from '@strudel.cycles/core';

/**
 * Initialises SwissGL by dynamically importing the module and setting up the canvas.
 * Canvas with ID `c` is used by SwissGL.
 * 
 * @async
 * @function initSwissGL
 * @example await initSwissGL()
 * @return {undefined} Does not return anything, but adds glsl to the global scope.
 */
export async function initSwissGL() {
  if (!document.getElementById('c')) {
    const module = await import('https://jarmitage.github.io/swissgl/swissgl.mjs')
    const SwissGL = module.default;
    const { canvas: testCanvas } = getDrawContext();
    const swissglCanvas = testCanvas.cloneNode(true)
    swissglCanvas.id = 'c'
    testCanvas.after(swissglCanvas)
    self.glsl = SwissGL(swissglCanvas)
  }
}

/**
 * Returns a function that queries a Pattern for a value at the current time.
 * The same as `hydra.mjs`'s `H` function but with a different name.
 *
 * @function GL
 * @param {object} p - The Pattern to be queried.
 * @returns {function} A function that, when invoked, queries the arc and returns a value.
 * @example GL("0 1 2")();
 */
export const GL = (p) => () => p.queryArc(getTime(), getTime())[0].value;

/**
 * Template string literal tag for GLSL code, since Strudel transpiles regular strings into mini-notation.
 *
 * @function gl
 * @param {Array} shader - The shader as a template string literal.
 * @returns {*} The shader string as the first element of the template string literal array.
 * @example FP:gl`sin(length(XY)*vec3(10,20,30)-time+atan(XY.x,XY.y)*10),1`
 */
export const gl = shader => shader[0]

/**
 * Turns a dictionary of Patterns into a dictionary of Pattern query functions via `GL()`.
 * This is passed to glsl's params dict via the spread operator (...).
 * This allows glsl to query the Patterns every time it updates.
 *
 * @function toGL
 * @param {dict} pats - Dictionary of Patterns.
 * @param {function} [f=GL] - Pattern query function (defaults to GL).
 * @returns {dict} Dictionary of Pattern query functions.
 * @example 
 * let r = "1000 20 <40 5 6 7> 10 100".slow(4)
 * let g = "10 100 20 30 40".slow(4)
 * let b = "1 2 3 4".fast(4)
 * glsl.loop(({time})=>{
 *     glsl.adjustCanvas(); 
 *     glsl({time, ...toGL({r,g,b}, Aspect:'cover',FP:gl`
 *     sin(length(XY)*vec3(r,g,b)
 *     -time+atan(XY.x,XY.y)*10),1`});
 * });
 */
const toGL = (pats, f=GL) => {
  let glPats = {};
  for (let p in pats) {
    glPats[p] = f(pats[p]);
  }
  return glPats;
}

/**
 * 
 */
// const loop = callback => {
//   const frameFunc = time => {
//     const res = callback({glsl, time:time/1000.0});
//     if (res != 'stop'){ 
//       window.animationFrameId = requestAnimationFrame(frameFunc);
//       console.log('created', window.animationFrameId)
//     }
//   };
//   if(window.animationFrameId) {
//     cancelAnimationFrame(window.animationFrameId);
//     console.log('cancelled', window.animationFrameId)
//   }
//   requestAnimationFrame(frameFunc);
// };

