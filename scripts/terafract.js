/*
Author:     John Lynch
Date:       August 2018
Language:   Javascript
Contents:   A basic fractal image generator for escape-time fractal functions
*/

// Set some basic parameters:
const W = 768;
const H = 768;
var aspectRatio = W / H;

var numPixels = W * H;   // size of our iteration-count array iterationCounts
var iterationCounts = [];

const escapeRadius = 6;     // radius of the circle outside of which we say
// a point has escaped and terminate the iteration loop, recording the iteration count at that time.
var escapeRadiusSquared = escapeRadius * escapeRadius;

const colours = [

                ["#000000", "#ffffff", "#000000", "#ffffff", "#000000", "#ffffff", "#000000",
                 "#ffffff", "#000000", "#ffffff", "#000000", "#ffffff", "#000000", "#ffffff",
                 "#000000", "#ffffff", "#000000", "#ffffff", "#000000"],

                ["#000000", "#4d00ff", "#000000", "#81002b", "#000000", "#2c35ff", "#000000",  
                "#ff11ff", "#000000", "#ba1257", "#000000", "#051d78",                 
                "#000000", "#ff32ff", "#000000", "#e30568", "#000000", "#010335", "#000000"],

                ["#000000", "#ffdab9", "#000000", "#3e99ff", "#000000", "#ffd43e", "#000000",
                 "#ffd9e7", "#000000", "#00c9ff", "#000000", "#ffc389", "#000000", "#9ccbff",
                 "#000000", "#4d001a", "#000000", "#e6e9ff", "#000000"],

                ["#000000", "#3aa5f5", "#000000", "#331a80", "#000000", "#ffd4b1", "#000000",  
                "#3c6cc4", "#000000", "#ff7200", "#000000", "#12007b",                 
                "#000000", "#ffffff", "#000000", "#41c4ff", "#000000", "#418eff", "#000000"],

                ["#000000", "#e6a60a", "#000000", "#83001b", "#000000", "#ffaab4", "#000000",
                 "#020a4f", "#000000", "#ffc295", "#000000", "#ff7a00", "#000000", "#60000a",
                 "#000000", "#0062a1", "#000000", "#dee0ec", "#000000"]

                ];

var modifiedColours = true;     // different method of colour mapping;
                                // will introduce a button to allow user to toggle this

// Set some default values for user-settable parameters:
var exponent = 2;
var funcIndex = 0;
var altFuncIndex = 0;
var paletteIndex = 0;
var composeFunctions = false;
var maxIterations = 32;

var isJulia = false;    // true if we're iterating Julia sets, false otherwise
var juliaPoint = ZERO;  // This var holds the "c" as in "z squared plus c"

// Define parameters of the orthogonal rectangular subset of the Complex plane we're looking at

var zMin = {re: -2, im: -2};    // corners of the region of the Complex plane we're looking at
var zMax = {re: 2, im: 2};
var xSpan = zMax.re - zMin.re;  // size of the region of the Complex plane we're looking at
var ySpan = zMax.im - zMin.im;
var xIncr = xSpan / W;       // the distance in complex number terms between each point iterated
var yIncr = ySpan / H;       

// pixel coords for drag/zoom
var topLeftX = 0;
var topLeftY = 0;
var bottomRightX = W;
var bottomRightY = H;

var dragging = false;   // true if user is dragging to zoom
var colourShift = 0;    // user can shift the palette any number of steps cyclically in one direction

var zoomFactor = 1.4142135623730951;    // root 2; a var because I might let user vary it
var numPixelsToMove = 100;      // when we "Move left" etc.

var mBoxScale = -1.5;   // used in Mandelbox function; may allow user to vary it in future

// const colours = ["#000000", "#56cbff", "#000000",  
//          "#ff7ccd", "#000000", "#f93457", "#000000",  "#305cff",                  
//          "#000000", "#008aff", "#000000", "#000000", "#c33664", "#ffdcb0", "#000000"];

// Now, our array of functions designed to produce pretty pictures:
var funcs = [

    (z, c) => add(pow(z, exponent), c),     // standard Mandelbrot / Julia of "z -> z cubed plus c"
    (z, c) => add(pow(absRealAndImag(z), exponent), c),     // Burning Ship
    (z, c) => add(pow(polar(Math.sin(z.re) * Math.cos(z.im) * Math.PI, arg(z)), exponent), c),
    (z, c) => add(pow({re: Math.sin(z.re) * Math.cos(z.im) * Math.PI, im: arg(z)}, exponent), c),                                   
    (z, c) => add(pow(polar((Math.sin(z.re) + Math.cos(z.im)) * Math.PI, arg(z)), exponent), c),
    (z, c) => add(pow({re: (Math.sin(z.re) + Math.cos(z.im)) * Math.PI, im: (Math.sin(z.re) + Math.cos(z.im)) * Math.PI}, exponent), c),                                   
    (z, c) => add(pow(polar(Math.cos(z.re) * Math.cos(z.im) * Math.PI, arg(z)), exponent), c),
    (z, c) => add(pow({re: Math.cos(z.re) * Math.cos(z.im) * Math.PI, im: arg(z)}, exponent), c),                                   
    (z, c) => add(pow(polar((Math.cos(z.re) + Math.cos(z.im)) * Math.PI, arg(z)), exponent), c),
    (z, c) => add(pow({re: (Math.cos(z.re) + Math.cos(z.im)) * Math.PI, im: (Math.sin(z.re) + Math.cos(z.im)) * Math.PI}, exponent), c),                                   
    (z, c) => add(pow(mult(ballFold(boxFold(z, 1.0), 0.5, 1.0), mBoxScale), exponent), c),     // 87 Mandelbox from https://en.wikipedia.org/wiki/Mandelbox                                                                                                          
    (z, c) => add(pow(mult(boxFold(ballFold(z, 0.5, 1.0), 1.0), mBoxScale), exponent), c),     // 88 Mandelbox with folds reversed      
    (z, c) => add(pow(mult(ballFold(boxFold(z, 1.0), 0.5, 1.0), mBoxScale), exponent - 1), c), // 87 Mandelbox with exponent lowered
    (z, c) => ballFold(boxFold(add(mult(z, mBoxScale), c), 0.5), 0.5, 1.0),                    // 103 Mandelbox shuffle functions                                                                                                                              
    (z, c) => add(pow(polar(Math.log10(Math.abs(Math.cos(z.re) / Math.cos(z.im))), arg(z)), exponent), c), // 391 
    (z, c) => add(pow(polar(arg(z) + z.re + z.im, arg(z)), exponent), c),
    
    ];

// Now we know how many colour palettes and how many functions there are, we can update the UI:
document.getElementById("func-index").max = funcs.length - 1;
document.getElementById("alt-func-index").max = funcs.length - 1;
document.getElementById("palette-index").max = colours.length - 1;

// OK, so let's create a canvas to draw on:    
const canv = document.getElementById("root-canvas");
canv.width = W;
canv.height = H;
const gc = canv.getContext("2d");   // get a graphics context
var imgData = gc.createImageData(W, H); // create an ImageData object, which is an array-like thing

// Now everything's set up we can call the main draw() function; this draw-update loop pattern I learnt from making 
// Iterated Function System (IFS) fractals in Clojure using the Quil library.
// See my repo at https://github.com/teraspora/fractagons.
// In this case, though, we don't just keep on iterating!
draw();

// ==============================================================================

function draw() {
    for (i = 0; i < imgData.data.length; i += 4) {      // image data has 4 entries (RGBA) for each pixel, scanning L to R for each line
            // Why start at 1, not 0?  Well, had it at zero but a reddish pallette produced greenish colours; shifting one byte seemed
            // to produce correct colours so maybe byte 0 is a header byte or magic number??   For now I'll just leave it at 1.
        var pixelNum = Math.floor(i / 4);
        // Get x and y coords of pixel
        var px = Math.floor(pixelNum % W);
        var py = Math.floor(pixelNum / W);
        var z = pixelToComplex(px, py);

        iterationCounts[i / 4] = iterate(z);     // iterate the function and get the iteration count        
    }
    reallyDraw();
}

function reallyDraw() {
    var numFirstColours = colours[paletteIndex].length - 1; // the first colour must not be the last!
    var colourMappingFactor = (colours[paletteIndex].length - 2) / maxIterations; 
    for (i = 0; i < numPixels; i++) {
        var iterationCount = iterationCounts[i];
        var colourIndex = modifiedColours ? (iterationCount + colourShift) % numFirstColours : (iterationCount * colourMappingFactor + colourShift) % numFirstColours; // map iteration count to a colour
        var firstColourIndex = Math.floor(colourIndex);
        var interpolationFactor = colourIndex % 1;
        
        // slight hack here, in case iteration value is over max 
        // (may not actually need this...)
        if (firstColourIndex >= numFirstColours) {
            firstColourIndex = numFirstColours - 1;
            fraction = 1.0;
        }
        // another hack!
        if (firstColourIndex < 0) firstColourIndex = 0;

        var finalColour = interpolateColour(hexrgb(colours[paletteIndex][firstColourIndex]), hexrgb(colours[paletteIndex][(firstColourIndex + 1) % colours[paletteIndex].length]), interpolationFactor);
        
        imgData.data[i * 4] = finalColour[0];
        imgData.data[i * 4 + 1] = finalColour[1];
        imgData.data[i * 4 + 2] = finalColour[2];
        imgData.data[i * 4 + 3] = 255;    // alpha component, we'll always have it opaque for now
    }    
    gc.putImageData(imgData, 16, 16);   // ok, we have our imgData object populated, so write it out
}

function iterate(z) {
    var realIterations, numIterations = 0;
    var z0 = isJulia ? juliaPoint : z;
    var zAbs = mod2(z), zAbsPrevious;
    while (numIterations < maxIterations && mod2(z) < escapeRadiusSquared) {
        numIterations++;
        z = !composeFunctions ? funcs[funcIndex](z, z0) : compose(funcs[funcIndex], funcs[altFuncIndex], z, z0);
        zAbsPrevious = zAbs;
        zAbs = mod2(z);
    }
    // This algorithm for the fractional part of the colour index, based on how far
    // the final value of z is from the bailout circle, modified from
    // "On Smooth Fractal Coloring Techniques" by Jussi H¨ark¨onen 
    // (Master’s Thesis, Dept. of Mathematics, °Abo Akademi University), available as .pdf from
    // http://jussiharkonen.com/gallery/coloring-techniques/
    if (zAbs < escapeRadius) {
        realIterations = numIterations + 1 - (Math.log(Math.log(zAbs + 1) + 1) / Math.log(Math.log(escapeRadius + 1) + 1));
    }
    else {
        var far = Math.max(exponent, Math.log(zAbs) / Math.log(zAbsPrevious));
        // escapeRadius2 = Math.pow(escapeRadius, far);
        realIterations = numIterations - ((Math.log(Math.log(zAbs)) - Math.log(Math.log(escapeRadius))) / Math.log(far));
    }
    return ++realIterations;
}

// HELPER FUNCTIONS
// ================
function compose(f1, f2, z, c) {    // helper function to compose two f:(z, c) => z1 type functions
    return f1(f2(z, c), c);
}

function pixelToComplex(px, py) {
    return {re: px * xIncr + zMin.re, im: py * yIncr + zMin.im};
}

// MOUSE HANDLING
// ==============

function clickHandler(e) {
    if (dragging) {
        dragging = false;
        return;
    }
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

function dragStartHandler(e) {
    e = e || window.event;
    var pixel = getMousePos(canv, e);
    topLeftX = pixel.x;
    topLeftY = pixel.y;
    dragging = true;
    console.log("Drag started at (" + topLeftX + ", " + topLeftY + ")");
    document.addEventListener("mouseup", dragFinishedHandler);
}

function dragFinishedHandler(e) {
    e = e || window.event;
    var pixel = getMousePos(canv, e);
    bottomRightX = pixel.x;
    bottomRightY = pixel.y;
    // if only a few pixels it's not a real drag, it's a click:
    if (Math.abs(bottomRightX - topLeftX) < 5 || Math.abs(bottomRightY - topLeftY) < 5) {
        dragging = false;
        return;
    }
    document.removeEventListener("mouseup", dragFinishedHandler);
    // do some maths!
    var pixelSpanX = bottomRightX - topLeftX;
    var pixelSpanY = bottomRightY - topLeftY;
    var dragLength2 = pixelSpanX * pixelSpanX + pixelSpanY * pixelSpanY; // Pythagoras!
    var newHeight = Math.sqrt(dragLength2 / (1 + aspectRatio * aspectRatio));
    var newWidth = newHeight * aspectRatio;
    var xMin = zMin.re;
    var yMin = zMin.im;
    var xMax = zMax.re;
    var yMax = zMax.im;
    zMin = pixelToComplex(topLeftX, topLeftY);
    zMax = {re: xMin + (topLeftX + newWidth) / W * xSpan, im: yMin + (topLeftY + newHeight) / H * ySpan};
    updateGeometryVars();

    draw();
}

function getMousePos(c, e) {       // got from https://codepen.io/chrisjaime/pen/lcEpn; takes a canvas and an event (mouse-click)
    var bounds = c.getBoundingClientRect();
    return {
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top
    }
}

// attach handlers to click  and mousedown events
document.getElementById("root-canvas").addEventListener("mousedown", dragStartHandler);
document.getElementById("root-canvas").addEventListener('click', clickHandler);
document.getElementById("zoom-in").addEventListener('click', scale);
document.getElementById("zoom-out").addEventListener('click', scale);
document.getElementById("move-left").addEventListener('click', translate);
document.getElementById("move-right").addEventListener('click', translate);
document.getElementById("move-up").addEventListener('click', translate);
document.getElementById("move-down").addEventListener('click', translate);
document.getElementById("reset").addEventListener('click', reset);
document.getElementById("colour-shift").addEventListener('click', shiftColours);
document.getElementById("max-iterations").addEventListener('input', function() {
    maxIterations = this.value;
});
document.getElementById("iterate").addEventListener('click', draw);
document.getElementById("exponent").addEventListener('input', function() {
    exponent = this.value;
});

document.getElementById("func-index").addEventListener('input', function() {
    funcIndex = this.value;
});

document.getElementById("alt-func-index").addEventListener('input', function() {
    altFuncIndex = this.value;
});

document.getElementById("palette-index").addEventListener('input', function() {
    paletteIndex = this.value;
    reallyDraw();
});

document.getElementById("compose").addEventListener("change", function() {
    composeFunctions = this.checked;
});

// ====================

// COLOUR STUFF
// ====================

function interpolateColour(colour1, colour2, factor) {  // factor should be between 0 and 1
  if (arguments.length < 3) { factor = 0.5; }
  // hack 2018-08-27: need to further investigate why null passed
  if (!colour1) colour1 = [0, 0, 0];
  if (!colour2) colour2 = [0, 0, 0];  

  var rgb1 = colour1.slice();
  var rgb2 = colour2.slice();
  var result = [];

  for (var i=0;i<3;i++) {
    result[i] = Math.round((1 - factor) * rgb1[i] + factor * rgb2[i]);
  }
  return result;
}

// Convert a #ffffff hex string into an [r,g,b] array
function hexrgb(hexColour) {
    var rgb = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColour);  // pull out 3 pairs of hex digits
    return rgb ? [parseInt(rgb[1], 16), parseInt(rgb[2], 16), parseInt(rgb[3], 16)] : null;
}

// UI FUNCTIONS
// ============

function shiftColours() {
    colourShift = (colourShift + 1) % colours[paletteIndex].length;
    reallyDraw();
}

// GEOMETRY STUFF
// ==============

function scale() {
    var zoomRatio = this.id === "zoom-out" ? zoomFactor : 1.0 / zoomFactor;
    var halfDiag = {re: xSpan / 2, im: ySpan / 2};
    var centre =  add(zMin, halfDiag);
    zMin = {re: centre.re - halfDiag.re * zoomRatio, im: centre.im - halfDiag.im * zoomRatio};
    zMax = {re: centre.re + halfDiag.re * zoomRatio, im: centre.im + halfDiag.im * zoomRatio};
    updateGeometryVars();
    draw();
}

function translate() {
    var windowShiftDeltaX = (zMax.re - zMin.re) / W * numPixelsToMove;
    var windowShiftDeltaY = (zMax.im - zMin.im) / H * numPixelsToMove;
    
    if (this.id === "move-left") {
        zMin.re += windowShiftDeltaX;
        zMax.re += windowShiftDeltaX;
    }
    else if (this.id === "move-right") {
        zMin.re -= windowShiftDeltaX;
        zMax.re -= windowShiftDeltaX;
    }
    else if (this.id === "move-up") {
        zMin.im += windowShiftDeltaY;
        zMax.im += windowShiftDeltaY;
    }
    else if (this.id === "move-down") {
        zMin.im -= windowShiftDeltaY;
        zMax.im -= windowShiftDeltaY;
    }
    updateGeometryVars();
    draw();
}

function updateGeometryVars() {
    xSpan = zMax.re - zMin.re;
    ySpan = zMax.im - zMin.im;
    xIncr = xSpan / W;
    yIncr = ySpan / H;
}

function reset() {
    zMin = {re: -2, im: -2};
    zMax = {re: 2, im: 2};
    updateGeometryVars();
    draw();
}