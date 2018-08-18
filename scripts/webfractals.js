const W = 768;
const H = 768;
const xSpan = 4;
const ySpan = 4;
var c = document.getElementById("root-canvas");
c.width = W;
c.height = H;
var ctx = c.getContext("2d");

var imgData = ctx.createImageData(W, H);

draw();

// function handler(e) {
//     e = e || window.event;

//     var pX = e.pageX;
//     var pY = e.pageY;

//     draw(pX, pY);
// }

function draw() {
    for (i = 0; i < imgData.data.length; i += 4) {

        var pixelNum = Math.floor(i / 4);
        var px = Math.floor(pixelNum % W)
        var py = Math.floor(pixelNum / W);

        imgData.data[i] = 32;
        imgData.data[i+1] = 0;
        imgData.data[i+2] = iterate(f, pixelToComplex(px, py));
        imgData.data[i+3] = 255;
    }
    ctx.putImageData(imgData, 16, 16);
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
    var z0 = z;
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
    return {re: px / (W / 4) - xSpan / 2, im: ySpan / 2 - py / (H / 4)}
}

// attach handler to click event
// if (document.attachEvent) document.attachEvent('onclick', handler);
// else document.addEventListener('click', handler);
