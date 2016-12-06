/** @module root/router */
'use strict';

const express = require('express');
const router = express.Router();
const middleware =  require('../middleware');


//supported methods
router.all('/', middleware.supportedMethods('GET, OPTIONS'));

//serve main static page of our app
router.get('/', function(req, res, next) {

  const options = {
      root: __dirname + '/app/',        
    };
  res.sendFile('index.html');
});
/** router for / */
module.exports = router;
