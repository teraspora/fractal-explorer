# Teraspora Fractal Explorer

## Introduction

This little Javascript app allows the user to generate interesting images by iterating functions over the complex plane, stopping iteration if the magnitude of the number or the number of iterations exceed pre-defined values.   In order to obviate sharp colour bands, which purely integer iteration counts would give, the count is modified according to how far out a point escapes, or if it doesn't, then how far inside the escape radius it is on the last iteration. This then results in gradations of shading when the colours are interpolated.

Such images are known as "Escape-time fractals", and the classic example is the well-known Mandelbrot Set, which is obtained by iterating the function 
`f(z): z -> z * z + c where z, c &‌#8946; &‌#8450;`.   If we set `c` to the initial value of z for each pixel, i.e. the Complex number to which that pixel maps, we get the Mandelbrot Set for the function.   If we set `c` corresponding to a particular pixel, the same value for every pixel we iterate, then we get the Julia Set of the function for that point.

To see how the structure of the Julia set varies as we go around the border of the standard Mandelbrot set, see my video "Julia Trip":  

<iframe width="320" height="180" src="https://www.youtube.com/embed/GTTlYxDHjtc" allow="autoplay; encrypted-media" allowfullscreen></iframe>

Such sets are called fractals because they exhibit an infinite level of detail (subject, of course, to hardware limitations and the precision of floats) and show self-similarity at different scales. To get an idea of this see my shader which zooms into the standard order 2 Mandelbrot Set:

<iframe width="320" height="180" src="https://www.shadertoy.com/embed/MlGcDw?gui=true&t=10&paused=false&muted=false" allowfullscreen></iframe>

I started programming escape-time fractals a few years ago in Java 8 with JavaFX, and I continue to develop this program, which I used to produce the "Julia Trip" video.

So to create the engine of this app, I basically translated the core engines of my Java app into Javascript, manually - also having to translate the functions to iterate from Java lambdas and replace <a href="https://github.com/teraspora/Complex">my Java Complex Number class</a> by Javascript functions.   Also, in the Java program I parallelise the iterations using one of the native parallel Stream functions, thus:
`IntStream.range(0, width * height).parallel().forEach(pixel -> iterate(pixel));`
and use four threads to set the colours in the four quadrants, but I have not yet learnt how to do this in Javascript.   However, I hope this to be a future enhancement, using "Web workers", I think, as currently this version is considerably slower than JVM Bytecode.

<p>We might decide that we&#39;ll do a maximum of 32 iterations and we&#39;ll stop iterating if the value goes outside a circle of radius 4 centred on the origin (remember we&#39;re in the complex plane).   A number z = x + iy is outside the circle if and only if x<sup>2</sup> + y<sup>2</sup> &gt; 16, so we can easily test for this.</p>

## UX
 
The purpose of the app is just the fun of seeing the interesting images that composed functions can produce, and the fun of exploring the hidden detail within some fractals.

The typical user will use the app for destressing, relaxing for a few minutes, enjoying coloured images as a change from a grey world for example, just as they might play a video game, but without the competitive element.

## Features

The controls are fairly self-explanatory.

I currently have four colour palettes, the first of which is monochrome, just black and white alternately.

Functions are:
- 0				Standard Mandelbrot (z => z * z + c)
- 1				Burning Ship fractal
- 2 & 3			A couple of trig-based functions
- 4, 5, 6 & 7	Mandelbox variants
- 8...          More trig-based functions

You can compose two functions by ticking the box and choosing an "alt function".

You can zoom in and out, move four ways, change or shift the colour palette, change the exponent (so for instance with exponent = 3, the Mandelbrot becomes z cubed + c) and vary the maximum iteration count.

The "Reset" button will reset the zoom levels back to initial default.

Full docs and instructions are accessible from the app itself.

<p>
	I use CSS Grid to style the app.   Between a Title Bar and a footer bar are three panels, containing the canvas to draw upon, the control panel with buttons and input elements, and a histogram of the colours in the image, for which ???????????????? is used.
</p>

### Features Left to Implement
- Make it responsive for mobile
- Make the controls neater
- Introduce more functions
- Add more colour palettes
- Document mouse zooming, trigify etc.

## Technologies Used

- [Javascript / ECMAScript](https://www.ecma-international.org/ecma-262/9.0/index.html)
    - The project uses **Javascript** for its functionality.
- [HTML5](https://www.w3.org/TR/html52/)
	- The project uses **HTML5** for its structure.
- [CSS3](https://www.w3.org/Style/CSS/Overview.en.html)
	- The project uses **HTML5** for its styling.
- [](????????????????????????????????)
	-The project uses **????** for displaying histograms.

## Testing

"In this section, you need to convince the assessor that you have conducted enough testing to legitimately believe that the site works well. Essentially, in this part you will want to go over all of your user stories from the UX section and ensure that they all work as intended, with the project providing an easy and straightforward way for the users to achieve their goals.

Whenever it is feasible, prefer to automate your tests, and if you've done so, provide a brief explanation of your approach, link to the test file(s) and explain how to run them.

For any scenarios that have not been automated, test the user stories manually and provide as much detail as is relevant. A particularly useful form for describing your testing process is via scenarios, such as:

1. Contact form:
    1. Go to the "Contact Us" page
    2. Try to submit the empty form and verify that an error message about the required fields appears
    3. Try to submit the form with an invalid email address and verify that a relevant error message appears
    4. Try to submit the form with all inputs valid and verify that a success message appears."

**Mention in this section how your project looks and works on different browsers and screen sizes.**

### Interesting Bugs

If I refresh the page, the browser retains previously input values in input elements like "Colour Palette", although they are initialised at the start of my script.   Some issue with caching, I guess...

## Deployment

This section should describe the process you went through to deploy the project to a hosting platform (e.g. GitHub Pages or Heroku).

In particular, you should provide all details of the differences between the deployed version and the development version, if any, including:
- Different values for environment variables (Heroku Config Vars)?
- Different configuration files?
- Separate git branch?

In addition, if it is not obvious, you should also describe how to run your code locally.


## Credits

### Algorithms
- jussi, benoit, ff

### Acknowledgements

- I received inspiration for this project from X
