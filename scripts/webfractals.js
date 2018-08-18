const W = 768;
const H = 768;


var zMin = {re: -2, im: -2};
var zMax = {re: 2, im: 2};
var xSpan = zMax.re - zMin.re;
var ySpan = zMax.im - zMin.im;


const colours = ["#000000", "#ffdcb0"  ,  "#000000",  "#c33664" ,  "#000000",  "#56cbff" ,  "#000000",  
         "#ff7ccd" ,  "#000000",  "#f93457" ,  "#000000",  "#305cff" ,                  
         "#000000",  "#008aff" ,  "#000000"];

const canv = document.getElementById("root-canvas");
canv.width = W;
canv.height = H;
const gc = canv.getContext("2d");
var imgData = gc.createImageData(W, H);

var isJulia = false;
var juliaPoint = {re: 0, im: 0};
var maxIterations = 256;

draw();

function draw() {
    var colourMappingFactor = (colours.length - 2) / maxIterations; 
    for (i = 0; i < imgData.data.length; i += 4) {      // image data has 4 entries (RGBA) for each pixel, scanning L to R for each line

        var pixelNum = Math.floor(i / 4);
        // Get x and y coords of pixel
        var px = Math.floor(pixelNum % W)
        var py = Math.floor(pixelNum / W);
        var iterationCount = iterate(f, pixelToComplex(px, py));
        var colourIndex = iterationCount * colourMappingFactor;
        var firstColourIndex = Math.floor(colourIndex);
        var interpolationFactor = colourIndex % 1;
        var finalColour = interpolateColour(hexrgb(colours[firstColourIndex]), hexrgb(colours[firstColourIndex + 1]), interpolationFactor);
        imgData.data[i] = finalColour[0];
        imgData.data[i+1] = finalColour[1];
        imgData.data[i+2] = finalColour[2];
        imgData.data[i+3] = 255;
        if (px === W / 2) console.log(iterationCount);
    }
    gc.putImageData(imgData, 16, 16);
}

function f(z, c) {		// standard Mandelbrot / Julia of "z -> z squared plus c"
    var x = z.re;
    var y = z.im;
    var newX = x * x - y * y + c.re;
    var newY = 2.0 * x * y + c.im;
    return {re: newX, im: newY};
}

function iterate(func, z) {
    var numIterations = 0;
    var z0 = isJulia ? juliaPoint : z;
    while (numIterations < maxIterations && cmod2(z) < 32) {
        numIterations++;
        z = func(z, z0);
    }
    return numIterations;
}

function cmod2(z) {
    var x = z.re;
    var y = z.im;
    return x * x + y * y;
}

function pixelToComplex(px, py) {
    return {re: px / (W / xSpan) - xSpan / 2, im: ySpan / 2 - py / (H / ySpan)}
}

// MOUSE CLICK HANDLING
// ====================
function clickHandler(e) {
    if (isJulia) {
        isJulia = false;
        draw();
        return;
    }
    e = e || window.event;
    var pixel = getMousePos(canv, e);
    var x = pixel.x;
    var y = pixel.y;
    juliaPoint = pixelToComplex(x, y);
    console.log("Clicked at (" + x + ", " + y + ")");
    isJulia = true;
    draw();
}

function getMousePos(c, e) {       // got from https://codepen.io/chrisjaime/pen/lcEpn; takes a canvas and an event (mouse-click)
    var bounds = c.getBoundingClientRect();
    return {
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top
    };
}


// attach handler to click event
if (document.attachEvent) document.attachEvent('onclick', clickHandler);
else document.addEventListener('click', clickHandler);

// ====================

// COLOUR STUFF
// ====================
// Th following code I stole from https://codepen.io/njmcode/pen/axoyD and slightly modified...

// Interpolates two [r,g,b] colors and returns an [r,g,b] of the result
// Taken from the awesome ROT.js roguelike dev library at
// https://github.com/ondras/rot.js

function interpolateColour(colour1, colour2, factor) {
  if (arguments.length < 3) { factor = 0.5; }
  var rgb = colour1.slice();
  for (var i=0;i<3;i++) {
    rgb[i] = Math.round(rgb[i] + factor*(colour2[i]-colour1[i]));
  }
  return rgb;
};

// Converts a #ffffff hex string into an [r,g,b] array
function hexrgb(hexColour) {
    var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColour);  // pull out 3 pairs of hex digits
    return rgb ? [
        parseInt(rgb[0], 16),
        parseInt(rgb[1], 16),
        parseInt(rgb[2], 16)
    ] : null;
};