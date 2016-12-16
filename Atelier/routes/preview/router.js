/** @module albums/router */
'use strict';

const express = require('express');
const router = express.Router();
const middleware =  require('../middleware');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Article = mongoose.model('Article');
const config = require("../../config");

//fields we don't want to show to the client
const fieldsFilter = { '__v': 0 };

//supported methods
router.all('/:articleid', middleware.supportedMethods('GET, PUT'));
router.all('/', middleware.supportedMethods('GET, PUT'));

router.get('/:articleid', function(req, res, next) {
  Article.findById(req.params.articleid, fieldsFilter).lean().populate('').exec(function(err, article){
    if (err) return next (err);
    if (!article) {
      res.status(404);
      res.json({
        statusCode: 404,
        message: "Not Found"
      });
      return;
    }
    res.json(article.text);
  });
});


module.exports = router;
