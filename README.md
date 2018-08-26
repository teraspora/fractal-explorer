# Fractal Explorer

This little app allows the user to generate fractal images within the browser by iterating functions and plotting the results.

Over the past few years I have been developing a Java application which generates escape-time fractals and can make movies and animations of them too.   So I knew what I was doing when I started this app, in terms of the logic and algorithms required.   This is a far simpler app, being less than 700 lines of code including all the HTML, CSS and Javascript, whereas my Java program is now about 6000 lines!

The basic idea is you iterate a function over the complex plane (f:Z->Z) and count the number of iterations until either you reach a certain predefined maximum iteration count, or the point escapes past a specified radius from the origin.   You then map these iteration counts to colours, but in order to obviate sharp colour bands, which purely integer values would give, you modify the count according to how far out a point escapes, or if it doesn't, then how far inside the escape radius it is on the last iteration.   This then results in gradations of shading when you interpolate the colours.

The controls are fairly self-explanatory.

I currently have four colour palettes, the first of which is monochrome, just black and white alternately.

Functions are:
- 0				Standard Mandelbrot (z => z * z + c)
- 1				Burning Ship fractal
- 2 & 3			A couple of trig-based functions
- 4, 5, 6 & 7	Mandelbox variants

You can compose two functions by ticking the box and choosing an "alt function".

You can zoom in and out, move four ways, change or shift the colour palette, change the exponent (so for instance with exponent = 3, the Mandelbrot becomes z cubed + c) and vary the maximum iteration count.

The "Reset" button will reset the zoom levels back to initial default.

## To do:

- Make it responsive for mobile
- Separate the colour mappiung from the iteration step.   Store the iteration counts in an array, then it will be snappier if the user just wants to change the colour as we won't need to repeat the iteration but just remap the counts to colours.
- Make the controls neater
- Introduce more functions
- Add more colour palettes