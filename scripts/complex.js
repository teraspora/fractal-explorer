/*
Author: 	John Lynch
Date: 		August 2018
Language: 	Javascript
Contents: 	A collection of basic complex number functions
*/

const ZERO = {re: 0, im: 0};
const ONE = {re: 1, im: 0};
const I = {re: 0, im: 1};

function toString(z) {
	return "" + z.re + " + " + z.im + "i";
}

// ======================================================================

function bar(z) {		// Complex conjugate
	return {re: z.re, im: -z.im}
}

function flipXY(z) {	// Switch the real and imaginary components
	return {re: z.im, im: z.re}
}

function absRealAndImag(z) {		// used famously for the Burning Ship fractal
	return {re: Math.abs(z.re), im: Math.abs(z.im)}
}

function mod(z) {			// Complex modulus or absolute value; note: mod() returns a real value
	var x = z.re, y = z.im;
	return Math.sqrt(x * x + y * y);
}

function mod2(z) {			// the square of the above; note: mod2() returns a real value
	var x = z.re, y = z.im;
	return x * x + y * y;
}

function arg(z) {			// The argument, or the angle to the X-axis; note: arg() returns a real value
	return Math.atan2(z.im, z.re);
}

// ======================================================================

function _add2(z, w) {	// just used for add()
	return {re: z.re + w.re, im: z.im + w.im};
}

function add(z, w) {
	return arguments.length <= 2 
		? _add2(z, w)
		: [].slice.call(arguments).reduce(_add2);
}

function sub(z, w) {
	return {re: z.re - w.re, im: z.im - w.im};
}

function mult(z, w) {		// w can be real
	return isNaN(w) ? {re: z.re * w.re - z.im * w.im, im: z.re * w.im + z.im * w.re}
					: {re: z.re * w, im: z.im * w};
}

function sq(z) {    
    return mult(z, z);
}

function recip(z){
	var x = z.re, y = z.im;
	var denom = x * x + y * y;
	return denom !== 0.0
		? {re: x / denom, im: -y / denom}
		: {re: Number.MAX_VALUE, im: Number.MAX_VALUE};		// just make it big if we have a zero modulus
}

function div(z, w){
	return mult(z, recip(w));
}

function fromReal(x) {
	return {re: x, im: 0};
}

// ======================================================================

function pow(z, n) {
	if (n < 0) return recip(z.pow(-n));
	if (n > 128) n= 128;			// it's Javascript running in the browser so limit it somewhat!
	switch(n) {
		case 0:
			return ONE;
		case 1:
			return z;
		case 2:		// unnecessary case but power 2 is most common so maybe this is a slight optimisation...
			return mult(z, z);			
		default:			
			return (n % 2 == 0) ? sq(pow(z, n / 2)) : mult(pow(z, n-1), z);
	}
}


// ======================================================================

function polar(r, theta) {		// make a standard Cartesian representation from a polar one
		return {re: r * Math.cos(theta), im: r * Math.sin(theta)};
}

function dot(z, w) {		// Note: vector dot product returns a real value
	return z.re * w.re + z.im * w.im;
}

function rotate(z, phi) {	// to rotate, multiply by the unit vector of the given angle
		return mult(z, polar(1.0, phi));
}

// ======================================================================

// boxFold() and ballFold() are used in the Mandelbox variants:
function boxFold(z, fold) {
	return {re:	z.re > fold ? 2.0 * fold - z.re : (z.re < -fold ? -2.0 * fold - z.re : z.re),
			im: z.im > fold ? 2.0 * fold - z.im : (z.im < -fold ? -2.0 * fold - z.im : z.im)};
}

function ballFold(z, r, bigR) {
	var zAbs = mod(z);
	r = Math.abs(r);
	return zAbs < r ? {re: z.re / (r * r), im: z.im / (r * r)}
					: 
		   (zAbs < Math.abs(bigR)
						?{re: z.re / (zAbs * zAbs), im: z.im / (zAbs * zAbs)}
						: z);
}
