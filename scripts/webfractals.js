const W = 768;
const H = 768;
const xSpan = 4.0;
const ySpan = 4.0;
const canv = document.getElementById("root-canvas");
canv.width = W;
canv.height = H;
const gc = canv.getContext("2d");
var imgData = gc.createImageData(W, H);

var isJulia = false;
var juliaPoint = {re: 0, im: 0};

draw();

function draw() {
    for (i = 0; i < imgData.data.length; i += 4) {

        var pixelNum = Math.floor(i / 4);
        var px = Math.floor(pixelNum % W)
        var py = Math.floor(pixelNum / W);

        imgData.data[i] = 8;
        imgData.data[i+1] = 0;
        imgData.data[i+2] = iterate(f, pixelToComplex(px, py));
        imgData.data[i+3] = 255;
    }
    gc.putImageData(imgData, 16, 16);
}

function f(z, c) {		// standard Mandelbrot
    var x = z.re;
    var y = z.im;
    var newX = x * x - y * y + c.re;
    var newY = 2.0 * x * y + c.im;
    return {re: newX, im: newY};
}

function iterate(func, z) {
    var numIterations = 0;
    var z0 = isJulia ? juliaPoint : z;
    while (numIterations < 256 && cmod2(z) < 16) {
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

// function clickHandler(e) {
//     if (isJulia) return;
//     e = e || window.event;
//     var x = e.pageX;
//     var y = e.pageY;
//     juliaPoint = pixelToComplex(x, y);
//     console.log("Clicked at (" + x + ", " + y + ")");
//     isJulia = true;
//     draw();
// }

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
