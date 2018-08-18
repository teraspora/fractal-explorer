# Web Fractals

This is an initial stab at converting my Java fractal generator into Javascript.   Well, not all 6000 lines of it!
Delighted that, after only one minor syntax error in my js, my initial attempt at generating a Mandelbrot set actually produced one, albeit in lurid tones and only two of them at that, rather than the 256 shades I was expecting.   OK, some more work needed!

So, now refactored code to get rid of hard-coded width and height, though at this stage setting as consts and my HTML canvas-wrapper has a fixed size at present.   Mainly it just meant changing the pixelToComplex() function and the draw() function.

