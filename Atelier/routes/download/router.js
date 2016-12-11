/** @module albums/router */
'use strict';

const express = require('express');
const router = express.Router();
const middleware =  require('../middleware');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Article = mongoose.model('Article');
const config = require("../../config");
const fs = require('fs');
let JSZip = require("jszip");

//fields we don't want to show to the client
const fieldsFilter = { '__v': 0 };

//supported methods
router.all('/:articleid', middleware.supportedMethods('GET, POST'));
router.all('/', middleware.supportedMethods('GET, POST'));


//get a album
router.post('/', function(req, res, next) {
  // console.log(req.body);
  let filetoread = ['./app/elements/menu-item/menu-item.html', './app/elements/menu-component/menu-component.html',
  './app/elements/article-item/article-item.html', './app/elements/switch-view/switch-view.html',
  './app/elements/image-component/image-component.html'];
  let subfiletoread = ['./app/elements/article/the-temp.html']
  let subsubtoread = ['./app/elements/article/Template_files/cssppms100mm_luganolac_1815911_16415_1.png',	'./app/elements/article/Template_files/ico_text_plus.png',
  './app/elements/article/Template_files/datepicker.css'	,				'./app/elements/article/Template_files/ico_tickets.png',
  './app/elements/article/Template_files/ico_facebook.png'	,			'./app/elements/article/Template_files/ico_twitter.png',
  './app/elements/article/Template_files/ico_fb.png'	,				'./app/elements/article/Template_files/impulse1.jpg',
  './app/elements/article/Template_files/ico_gallery.png'			,		'./app/elements/article/Template_files/impulse2.jpg',
  './app/elements/article/Template_files/ico_googleplus.png',				'./app/elements/article/Template_files/lac_logo_16.png',
  './app/elements/article/Template_files/ico_home.png'		,			'./app/elements/article/Template_files/lac_logo_w.png',
  './app/elements/article/Template_files/ico_linkedin.png'	,			'./app/elements/article/Template_files/lcal8517315151647_1.png',
  './app/elements/article/Template_files/ico_mail.png',					'./app/elements/article/Template_files/lcal851731516021_1.png',
  './app/elements/article/Template_files/ico_pinterest.png',				'./app/elements/article/Template_files/menu_mobile.png',
  './app/elements/article/Template_files/ico_search.png'	,				'./app/elements/article/Template_files/styles.lac.3.css',
  './app/elements/article/Template_files/ico_share.png'		,			'./app/elements/article/Template_files/styles.mediaHeight.css',
  './app/elements/article/Template_files/ico_text_1.png'	,				'./app/elements/article/Template_files/styles.phone.css',
  './app/elements/article/Template_files/ico_text_2.png'	,				'./app/elements/article/Template_files/styles.tablet.landscape.css',
  './app/elements/article/Template_files/ico_text_3.png'	,				'./app/elements/article/Template_files/styles.tablet.portrait.css',
  './app/elements/article/Template_files/ico_text_min.png',				'./app/elements/article/Template_files/vuoto.gif']
  let zip = new JSZip();
  let folder = zip.folder("export");
  let appf = folder.folder("app");
  let elements = appf.folder("elements");
  let article = elements.folder("article");
  let templ_file = article.folder("Template_files");
  filetoread.forEach(function(el){
    let contentPromise = new JSZip.external.Promise(function (resolve, reject) {
        fs.readFile(el, function(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
    let name = el.split('/')
    let temp = elements.folder(name[name.length -1].split('.')[0])
    temp.file(name[name.length -1], contentPromise);
  });

  let contentPromise2 = new JSZip.external.Promise(function (resolve, reject) {
      fs.readFile(subfiletoread[0], function(err, data) {
          if (err) {
              reject(err);
          } else {
              resolve(data);
          }
      });
  });
  let name2 = subfiletoread[0].split('/');
  article.file(name2[name2.length -1], contentPromise2);

  let contentPromise4 = new JSZip.external.Promise(function (resolve, reject) {
      fs.readFile('./bower.json', function(err, data) {
          if (err) {
              reject(err);
          } else {
              resolve(data);
          }
      });
  });
  let name4 = './bower.json'.split('/');
  folder.file(name4[name4.length -1], contentPromise4);


  subsubtoread.forEach(function(el){
    let contentPromise3 = new JSZip.external.Promise(function (resolve, reject) {
        fs.readFile(el, function(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
    let name3 = el.split('/');
    templ_file.file(name3[name3.length -1], contentPromise3);
  });

  appf.file("index.html", "<html> "+
    "<head> " +
      "<title> " +
      "  Export " +
      "</title>" +
      "<link rel=\"import\" href=\"./article/the-temp.html\">" +
    "</head> "+
    "<body>" +
    `<the-temp text="`+ req.body.text +`"> </the-temp>` +
    "</body>" +
  "</html>");
  // fs.createWriteStream('out.zip').pipe(res)
  zip
  .generateNodeStream({type:'nodebuffer',streamFiles:true})
  .pipe(fs.createWriteStream('./out.zip'))
  .on('finish', function () {
    // JSZip generates a readable stream with a "end" event,
    // but is piped here in a writable stream which emits a "finish" event.
    // console.log("out.zip written.");
  //   var filePath =  "./out.zip" // or any file format
  //
  // // Check if file specified by the filePath exists
  // fs.exists(filePath, function(exists){
  //     if (exists) {
  //       // Content-type is very interesting part that guarantee that
  //       // Web browser will handle res in an appropriate manner.
  //       res.writeHead(200, {
  //         "Content-Type": "application/zip",
  //         "Content-Disposition" : "attachment; filename= 'download'"});
  //       fs.createReadStream(filePath).pipe(res);
  //     } else {
  //       res.writeHead(400, {"Content-Type": "text/plain"});
  //       res.end("ERROR File does NOT Exists");
  //     }
  //   });

  });
  //
  // res.sendFile('/Users/Emanuele/UALAC/Atelier/out.zip');
  res.end();
});



/** router for /albums */
module.exports = router;
