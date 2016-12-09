/** @module models/index.js
* Loads all models
*/
'use strict';

const mongoose = require('mongoose');

require('./Article');


module.exports = {
  'Article' : mongoose.model('Article'),
  
}
