const config = require('./config');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const formidable = require('formidable');
const fs = require('fs');
const JSZip = require("jszip");
require('./models/Article');

// Connect to MongoDB here
const mongoose   = require('mongoose');
const Article = mongoose.model('Article');
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
app.post('/upload', function(req, res) {
  let form = new formidable.IncomingForm(
    {
      uploadDir: __dirname + '/app/images/',
      keepExtensions: true
    }
  );

  form.parse(req, function(err, fields, files) {
    let fileName = files.file.name;
    fs.rename(files.file.path, __dirname + '/app/images/' + fileName);
    res.json({name : fileName});
    res.end();
  });

});

app.get('/download', function(req,res, next){
  res.download('./output/out.zip', "download.zip");
  // res.end();
  setTimeout(function(){
    fs.unlink('./output/out.zip', (err) => {
    if (err) throw err;
    console.log('successfully deleted !');
    });
  }, 1000);

});

app.get('/all', function(req,res,next){
  console.log("list all files!");
  let arr = [];
  fs.readdir("./app/images", (err, files) => {
    console.log(files);
    res.json(files);
  })

});

// doAsyncstuff(listOfItems, cb){
//     var totalItems = listOfItems.length;
//     var processed = 0;
//     listOfItems.forEach(function(item){
//       fs.lstat(item, function(err, stat){
//         processed++;
//         if(stat.isFile()) // create file link
//         if(stat.isDir()) create dir link
//         if (processed == totalItems){
//           cb(err, links)
//         }
//       })
//     })
// }




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
app.use('/download', routers.download);
// app.use('/upload', routers.download);

module.exports = app;
