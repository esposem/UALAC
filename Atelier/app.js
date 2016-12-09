const config = require('./config');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express();

// Connect to MongoDB here
const mongoose   = require('mongoose');
mongoose.connect(config.mongoUrl + config.mongoDbName);

// Register model definition here
require('./models');

//configure app
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));    // parse application/x-www-form-urlencoded
app.use(bodyParser.json());    // parse application/json

// static files are served from /app
app.use(express.static(path.join(__dirname, 'app')));

// Initialize routers here

const routers = require('./routes/routers');
app.use('/', routers.root);

// intercepts requests that accept html and haven't been served
// from the static middleware, to send the main page
app.use('*', function(req,res, next){
  if(req.accepts('html')){
    const options = {
        root: __dirname + '/app/',
      };
    return res.sendFile('index.html', options);
  }

  next();
})

// json serving routes
app.use('/dashboard', routers.dashboard);
app.use('/article', routers.dashboard);
app.use('/preview', routers.preview);

module.exports = app;
