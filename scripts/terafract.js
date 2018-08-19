const W = 1000;
const H = 1000;
var aspectRatio = W / H;

// Define parameters of the orthogonal rectangular subset of the Complex plane we're looking at


var zMin = {re: -2, im: -2};
var zMax = {re: 2, im: 2};

var xSpan = zMax.re - zMin.re;
var ySpan = zMax.im - zMin.im;
var xIncr = xSpan / W;
var yIncr = ySpan / H;

// pixel coords for drag/zoom
var topLeftX = 0;
var topLeftY = 0;
var bottomRightX = W;
var bottomRightY = H;

var dragging = false;
var colourShift = 0;

var zoomFactor = 2.0;
var numPixelsToMove = 100;

const colours = ["#000000", "#56cbff", "#000000",  
         "#ff7ccd", "#000000", "#f93457", "#000000",  "#305cff",                  
         "#000000", "#008aff", "#000000", "#000000", "#c33664", "#ffdcb0", "#000000"];

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
        // var z = {re: zMin.re + px * xIncr, im: zMin.im + py * yIncr};    // convert pixel to Complex
        var z = pixelToComplex(px, py);
        var iterationCount = iterate(f3, z);     // iterate the function and get the iteration count 
        var colourIndex = (iterationCount * colourMappingFactor + colourShift) % colours.length; // map iteration count to a colour
        var firstColourIndex = Math.floor(colourIndex);
        var interpolationFactor = colourIndex % 1;
        var finalColour = interpolateColour(hexrgb(colours[firstColourIndex]), hexrgb(colours[(firstColourIndex + 1) % colours.length]), interpolationFactor);
        imgData.data[i] = finalColour[0];
        imgData.data[i+1] = finalColour[1];
        imgData.data[i+2] = finalColour[2];
        imgData.data[i+3] = 255;
        // if (px === W / 2) console.log({
        //     "iterationCount": iterationCount,
        //     "colourIndex": colourIndex,
        //     "interpolationFactor": interpolationFactor,
        //     "finalColour": finalColour});
    }
    gc.putImageData(imgData, 16, 16);
}

// function f(z, c) {		// standard Mandelbrot / Julia of "z -> z squared plus c"
//     var x = z.re;
//     var y = z.im;
//     var newX = x * x - y * y + c.re;
//     var newY = 2.0 * x * y + c.im;
//     return {re: newX, im: newY};
// }

function f(z, c) {      // standard Mandelbrot / Julia of "z -> z squared plus c"
    return add(sq(z), c);
}

function f3(z, c) {      // standard Mandelbrot / Julia of "z -> z squared plus c"
    return add(pow(z, 3), c);
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

function cmod2(w) {
    var x = w.re;
    var y = w.im;
    return x * x + y * y;
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
    console.log("Should not get here after a drag!");
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

    console.log("Drag finished at (" + bottomRightX + ", " + bottomRightY + ")");
    document.removeEventListener("mouseup", dragFinishedHandler);
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

// function debugZooming(e) {
//     e = e || window.event;
//     var pixel = getMousePos(canv, e);
//     var x = pixel.x;
//     var y = pixel.y;
//     var w = pixelToComplex(x, y); 
//     console.log("px = " + x + ", py = " + y);
//     console.log("xIncr = " + xIncr + "\nyIncr = " + yIncr + "\nzMin = " + zMin.re + " + " + zMin.im + " i");
       
//     console.log("Clicked at (" + x + ", " + y + "):  maps to " + w.re + " + " + w.im + " i");
// }

// attach handlers to click  and mousedown events
// document.addEventListener('click', clickHandler);
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


// ====================

// COLOUR STUFF
// ====================
// The following code I stole from https://codepen.io/njmcode/pen/axoyD and slightly modified...

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
}

// Converts a #ffffff hex string into an [r,g,b] array
function hexrgb(hexColour) {
    var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColour);  // pull out 3 pairs of hex digits
    return rgb ? [
        parseInt(rgb[0], 16),
        parseInt(rgb[1], 16),
        parseInt(rgb[2], 16)
    ] : null;
}

/*
=============================================================================================================
                                                     {re: , im: }
*/ 

// UI FUNCTIONS
// ============

function shiftColours() {
    colourShift = (colourShift + 1) % colours.length;
    draw();
}

function scale() {
    var zoomRatio = this.id === "zoom-out" ? zoomFactor : 1.0 / zoomFactor;
    var halfDiag = {re: xSpan / 2, im: ySpan / 2};
    var centre =  {re: zMin.re + halfDiag.re, im: zMin.im + halfDiag.im};
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

// GEOMETRY STUFF
// ==============

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