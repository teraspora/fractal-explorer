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

function bar(z) {
	return {re: z.re, im: -z.im}
}

function flipXY(z) {
	return {re: z.im, im: z.re}
}

function absRealAndImag(z) {
	return {re: Math.abs(z.re), im: Math.abs(z.im)}
}

function mod(z) {			// Note: mod() returns a real value
	var x = z.re, y = z.im;
	return Math.sqrt(x * x + y * y);
}

function mod2(z) {			// Note: mod2() returns a real value
	var x = z.re, y = z.im;
	return x * x + y * y;
}

function arg(z) {			// Note: arg() returns a real value
	return Math.atan2(z.im, z.re);
}

// ======================================================================

function add(z, w) {
	return {re: z.re + w.re, im: z.im + w.im};
}

function sub(z, w) {
	return {re: z.re - w.re, im: z.im - w.im};
}

function mult(z, w) {
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
		: {re: Number.MAX_VALUE, im: Number.MAX_VALUE};
}

function div(z, w){
	return mult(z, recip(w));
}

// ======================================================================

function pow(z, n) {
	if (n < 0) return recip(z.pow(-n));
	if (n > 128) n= 128;			// else troppo cpu!
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

function polar(r, theta) {
		return {re: r * Math.cos(theta), im: r * Math.sin(theta)};
}

function dot(z, w) {		// Note: vector dot product returns a real value
	return z.re * w.re + z.im * w.im;
}

function rotate(z, phi) {
		return mult(z, polar(1.0, phi));
}

// ======================================================================

function boxFold(z, fold) {
	return {re:	z.re > fold ? 2.0 * fold - z.re : (z.re < -fold ? -2.0 * fold - z.re : z.re),
			im: z.im > fold ? 2.0 * fold - z.im : (z.im < -fold ? -2.0 * fold - z.im : z.im)};
}

function ballFold(z, r, bigR) {
	var zAbs = mod(z);
	r = Math.abs(r);
	return zAbs < r ? {re: z.re / r * r, im: z.im / r * r}
					: 
		   (zAbs < Math.abs(bigR)
						?{re: z.re / (zAbs * zAbs), im: z.im / (zAbs * zAbs)}
						: z);
}
