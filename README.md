# UALAC
Ualac is a simple Content Management System done with Node, Polymer and MongoDB. It allows an user to create articles for LAC (Lugano Arte and Cultura) webpages. Other than this purpose, this repo contains also the components we created that respect the ARIA guidelines for screen readers.

how to run it:

you need npm, node (and nodemon) and bower installed.

first of all, go in Atelier and run `npm install` and `bower install`

when it's done, you should have npm_components in /Atelier and bower_components in /Atelier/app

in /Atelier, run `npm start` or `DEBUG='ualac-server' nodemon ./bin/www`

# Components 

We created these components and tested them using Mac VoiceOver. All the components are built in a way that a screen reader can move between the various components, descriptions and button in a very smooth and simple way. Using some keyboard combination, it is also possible to control the components. Every time the reader is on one of these components, the voice will say which key to press to get the desidered behavior.

<b> Image </b> <br>
An image component that allows to add an image in the page, with the possibility to decide what to read in different descriptions.
The image component is located in `/app/elements/image-component` <br>
In screen reader mode:
* Press 1 for normal description
* Press 2 for concise description
* Press 3 for emotional description
```html
<image-component 
src= "/images/589108472327180a6c5af425/Fontaine.jpg"  <!-- insert the image path -->
 alt="image" <!-- insert the image name for the screen reader -->
 normal="normal description" <!-- insert the image full description -->
 simplified="simplified description"   <!-- insert the image concise description -->
 emotional="emotional description" <!-- insert the image emotional description -->
 text="text to speak" <!-- insert the additional text -->
style="display: block; width: 100%;"  <!-- insert image css -->
></image-component> 
``` 
<br>

<b> Video </b> <br>
A video player to add videos in the page. Easily to control with screen reader and keyboard.
The video component is located in `/app/elements/video-component` <br>
a youtube can be found in the url of a video:
<i> `https://www.youtube.com/watch?v=`<b>UNNnwF42Icg </b> </i>
In screen reader mode:
* Press `p` for play/pause video
* Press `m` for muting/unmuting video
* Press `+` to increase volume
* Press `-` to decrease volume
* Press `>` to go to the next 10 seconds
* Press `<` to go to the previous 10 seconds
* Press `t` to get the current time and total video time
```html
<video-component  
videoid= "insert youtube id here" <!-- insert the youtube id here -->
autoplay= "ms delay" <!-- 0 for starting the text from the beginning -->
pauseOnAria= "false" <!-- pause video when screen reader is reading -->
style="display: block; width: 100%;" <!-- insert the video css -->
>
</video-component>
```
<br>

<b> Switch View </b> <br>
A view with all event/artwork descriptions that it's usually displayed under the LAC webpages.
Provides a smooth screen reader movement between the different descriptions.
The switch view component is located in `/app/elements/switch-view` <br>
In screen reader mode, go on the desidered description and press enter to change it.

```html
<switch-view title='insert title here' <!-- insert the title that will be displayed -->
subtitle='insert subtitle here' <!-- insert the subtitle that will be displayed -->
normal='insert normal text here' <!-- insert the full text -->
simplified='insert simplified text here' <!-- insert the concise text -->
emotional='insert image path here'> <!-- insert the emotional text -->
</switch-view>
```
<br>

<b> Menu </b> <br>
Two components that can be used to create a menu that is readable by screen readers.
The menu component is located in `/app/elements/menu-component` <br>
The menu item is located in `/app/elements/menu-item` <br>
```html
<menu-component id="main-menu">
  <menu-item value="Info" link="http://www.luganolac.ch/it/about"></menu-item>
  <menu-item value="Visita" link="http://www.luganolac.ch/it/361/informazioni"></menu-item>
  <menu-item value="Orari" link="http://www.luganolac.ch/it/745/orari"></menu-item>
  <menu-item value="Biglietti" link="http://www.luganolac.ch/it/421/biglietteria-online"></menu-item>
  <menu-item value="Eventi" link="http://www.luganolac.ch/it/3/eventi"></menu-item>
  <menu-item value="LAC edu" link="http://www.luganolac.ch/it/597/lac-edu"></menu-item>
 </menu-component>
 ```
