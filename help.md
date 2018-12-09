# Teraspora Fractal Explorer - An Introduction

## Overview

On startup, the standard function `f(z, c) = z*z + c` is iterated to produce the well-known order 2 <a href="https://en.wikipedia.org/wiki/Mandelbrot_set">Mandelbrot Set</a>.
Various parameters may be adjusted via buttons, input elements or keyboard shortcuts.   

Two buttons cause re-iteration (and automatically redraw), whilst one just redraws:

- **"Iterate"** just reiterates the function(s) and redraws based on current values of parameters.
- **"Reset"** also resets the zoom levels and the x and y offsets.
- **"Redraw"** causes a redraw based on the currently stored iteration count array with any newly altered colour settings.

Some parameters, i.e. the index/indices of the function(s) being iterated, the order (exponent), the maximum number of iterations per pixel, the zoom level and the x and y offsets, affect the iteration.   Any change in these and you'll need to hit **"Iterate"** or **"Reset"** to see the changes.

Others, i.e. the colour palette in use, the amount the palette is shifted, the level of *trigification*, and a parameter which modifies the fractional part of the iteration count for a subtle effect, just affect the mapping of colours to iteration counts, and so only require a "Redraw" to see the results.

**"Modify Fraction"** and **"Trigify"** are Boolean switches, either on or off.   The text will always indicate the result of clicking, not the current state.

**"Trigify"** applies a function of my own devising which remaps the iteration counts.   Its effect may be varied with the "Trigify Level" selector.  Some images look better with this function applied.   Experimentation is the best guide.

**"Modify Fraction"** remaps the fractional part of the iteration count (determined in the iteration phase by the distance inside or outside the escape radius on the last iteration) using the function `f(x) = sin(πx/2)`, which maps the unit interval to itself.   This can have subtle effects on how one colour blends into the next.   Again, please experiment!   In a future release I may introduce Hermite interpolation as an option. 

## Functions

A number of functions are provided for the user to experiment with, including the standard Mandelbrot, the Burning Ship fractal, a version of the 2D *Mandelbox* and a bunch of trigonometric functions of my own devising.   Note that I take sines and cosines of the real and imaginary components separately:  I don't use the Complex versions of these functions as in my experience they tend to produce fractured images.

More functions will be included in a future version.

When **"Compose"** is ticked, functions are composed, thus, if **"Function"** is `f(z, c)` and **"Alt Function"** is `g(z, c)` then composing functions results in `f(g(z, c), c)` being iterated. 

Note that the user can also vary the associated exponent to see the effects higher-order functions have upon the image.

## Get started

Just play!

- Change the exponent to see higher-order Mandelbrot sets.
- Experiment with colour palettes, trigification, fraction modification and palette shifting.
- Change the exponent back to 2 and the function index to 2 and you will get the famous <a href="https://en.wikipedia.org/wiki/Burning_Ship_fractal">Burning Ship Fractal</a>.
- Zoom in to see more detail or zoom out to see more of the extent of the image.
- Note that the **"Move"** buttons move the image, not the window.
- Set the alt-function and tick the **"Compose"** checkbox.   Then click **"Iterate"** or **"Reset"**.   You are now seeing the effect of iterating two composed functions.
- Setting the maximum iteration count to high values can in some cases give you more detail but will take longer.   Don't go wild unless you have a super-fast CPU!

## Mouse zooming

You can also zoom by using the mouse:  just drag with the primary mouse button on from the top-left corner to the bottom-right corner of the square you'd like to enlarge.

## Julia Sets

Each point of the Mandelbrot set (or of any set thus created with the escape-time method) corresponds to a <a href="https://en.wikipedia.org/wiki/Julia_set">Julia Set</a>, and by clicking on a point you can view its Julia Set.
Click again to go back to the Mandelbrot (or its generalisation).

## Keyboard Shortcuts

| Shortcut  | Button equivalent |
| ------------- | ------------- |
| SPACE  | Iterate  |
| /  | Redraw  |
| +  or = | Zoom in |
| - | Zoom out |
| z | Reset |
| c | Toggle Compose |
| t | Toggle Trigify |
| m | Toggle Modify Fraction |

