## Getting Started

### Anatomy of the skeleton

    |-- README.html //What you're reading right now
    |-- README.md // Source for what you're reading right now
    |-- app.js //main file
    |-- bin
    |   `-- www //starts app.js
    |   `-- installSeleniumAndChromeWebDriver //installs selenium and chrome driver
    |-- config.js  //configuration like mongodb url
    |-- models //mongoose models
    |-- node_modules //npm packages
    |-- bower.json //you have to SAVE your elements' dependencies here
    |-- package.json
    |-- app //the client side app. All the polymer stuff go there
    |   |-- bower_components //bower components
    |   |-- css
    |   |-- elements //DEFINE YOUR ELEMENTS HERE!!
    |   |-- images
    |   |-- js //contains utility script
    |   |-- styles //polymer styles (files that have .html extension)
    |   |-- tracks_folder //put your tracks here
    |   `-- index.html //entry for the polymer app 
    |-- routes  //exress routers routers
    |-- seed.js //execute it to seed the database
    |-- test
    |   |-- seedData.js //used by seedDb.js
    |   |-- seedDb.js //seeds the database
    |   `-- utils.js //various utils for the tests

### Install dependencies
To install the dependencies for the exercise (express.js, mongoose, testing framework, etc.) type:

    npm install && bower install

## Client side
### Dependencies
#### Installing and Saving
Install and save (in `bower.json`) a bower dependency using:

```bash
bower install --save
```

__Important Note__: If there are bower dependencies in your code that are not saved in `bower.json` you will be penalized. 

#### Location
By default bower install dependencies in a `./bower_components`, but in this exercise bower dependencies are installed in `app/components` as instructed by the `.bowerrc` in the root dir of the skeleton (for more on that have a look here [bowerrc docs](http://bower.io/docs/config/)). The reason for changing the directory is simple: we want it to be in the same folder as the app to serve the files using the static middleware.

### Elements
Your elements should encapsulate most of the markup in their __shadow DOM__ and especially presentational markup. For example `<ab-playlist-header-info>` will encapsulate the canvas and all the info for the playlist in its shadow DOM. However, sometimes it makes sense to have children in the light DOM. As an example, `<ab-menu>` may have `<ab-menu-items>` in it's light DOM.

#### Automatic node finding
One neat feature of Polymer is [automatic node finding](https://www.polymer-project.org/1.0/docs/devguide/local-dom.html#node-finding). 
From the polymer documentation:

>Polymer automatically builds a map of statically created instance nodes in its local DOM, to provide convenient access to frequently used nodes without the need to query for them manually. Any node specified in the element’s template with an `id` is stored on the `this.$` hash by `id`.

>__Note__: Nodes created dynamically using data binding (including those in  `dom-repeat` and `dom-if` templates) are not added to the `this.$`` hash. The hash includes only statically created local DOM nodes (that is, the nodes defined in the element’s outermost template).

Example (from Polymer's docs):

```html
<dom-module id="x-custom">

  <template>
    Hello World from <span id="name"></span>!
  </template>

  <script>

    Polymer({

      is: 'x-custom',

      ready: function() {
        this.$.name.textContent = this.tagName;
      }

    });

  </script>

</dom-module>
```

### Third-party elements
Feel free to use other elements if you want to. The only restriction is that for `<ab-menu>` you cannot use `<iron-selector>`, `paper-menu` or other menu-focused elements. You __have to__ apply the [IronMenuBehavior](https://elements.polymer-project.org/elements/iron-menu-behavior?active=Polymer.IronMenuBehavior) behavior.
You can have a look at the following links to get inspired:

* [Polymer Elements](https://elements.polymer-project.org/)
* [Custom Elements](https://customelements.io/)

### Frontend Routing
For routing we are using [app-route](https://elements.polymer-project.org/elements/app-route). It allows for [modular routing](https://www.polymer-project.org/1.0/blog/routing). For a comprehensive guide have a look [here](https://www.polymer-project.org/1.0/toolbox/routing). The routes of your frontend app aand what they should display as the main content:

1. `/` or `/library`: should display `<ab-tracklist>`
2. `/artists`: should display an `<ab-thumblist>` populated with the artists
3. `/albums`: should display an `<ab-thumblist>` populated with the albums
4. `/library`: should display `<ab-playlist-header-info>` together with `<ab-tracklist>` populated with the info of the selected playlist


### Icons
While we have no preference over how and which icons you use in your app, you may want to consider using the [<iron-icon>](https://elements.polymer-project.org/elements/iron-icon) elements with icons from one of the provide icon-sets inside [iron-icons](https://elements.polymer-project.org/elements/iron-icons). If you use one of the icon sets of `iron-icons`, the import of iron-icons will also import `<iron-icon>` for you.
A demo of all the icons provided by the Polymer team can be found [here](https://elements.polymer-project.org/elements/iron-icons?view=demo:demo/index.html).

Example usage:

```html
<link rel="import" href="../iron-icons/maps-icons.html">

<!-- somewhere inside your element -->
<iron-icon icon="maps:directions-bus"></iron-icon>
```

## Server

### Note
The server is almost identical to the server used in Exercise 6 which was building on the server used in Exercise 5. For differences scroll down to the [REST API](#rest-api) and [Static assets](#static-assets)

### Run the server
`app.js` is exported as a module so that we can  `require()` it from other modules, eg. out tests. For this reason the server does not `listen()` from within `app.js`. The initialization of the server is carried out with `./bin/www`, an executable file the _requires_ `app.js` calls `listen()`. To start:
    
```
$ npm start
```
or
```
$ DEBUG='atelierbeats-server' node ./bin/www
```

The `DEBUG` environmental variable is read by the excellent [debug](https://github.com/visionmedia/debug) module which allows to isolate debug messages output per module.

if you want to use nodemon:

```
$ npm run start:dev
```

### Differences from Exercise 6
####Templates
`Dust.js` templates have been removed, as have the related grunt tasks.

####REST API
`GET /user/:userid/playlists` returns the tracks of the playlists prepopulated.

####Static assets
The static assets for this exercise are served from within the `app` directory (in the previous exercises the were served from `public`). `GET /` renders `app/index.html`.
