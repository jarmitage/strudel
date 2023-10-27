# swissgl

This package integrates [swissgl](https://swiss.gl) into strudel.

## Usage in Strudel

This package is imported into strudel by default. To activate Hydra, place this code at the top of your code:

```js
await initSwissGL();
```

Then you can use swissgl below!

## SwissGL Demos

### [tiny.html](https://github.com/google/swissgl/blob/main/tiny.html)

```js
await initSwissGL()
let r = "1000 20 <40 5 6 7> 10 100".slow(4)
let g = "10 100 20 30 40".slow(4)
let b = "1 2 3 4".fast(4)
let p2 = "10"
glsl.loop(({time})=>{
    glsl.adjustCanvas(); 
    glsl({time, r:P(r), g:P(g), b:P(b), p2:P(p2), Aspect:'cover',FP:gl`
    sin(length(XY)*vec3(r,g,b)
    -time+atan(XY.x,XY.y)*p2),1`});
});
```
