var express = require('express');
var app = express();
var http = require('http');
var formidable = require('formidable');
var imageDir = null
var publicDir = require('path').join(__dirname,'/test-image');
const fs = require('fs');
const path = require('path');
var result = '';
const directory = 'test-image/1';
var sstring = '<head><title>OCT classification</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"><script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script><script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script></head><body><div class="jumbotron"><center><h1>Retinal OCT Classification</h1>';
var endstring = '</center></div></body>';
fs.readdir(directory, (err, files) => {
    if (err) throw err;
  
    for (const file of files) {
      fs.unlink(path.join(directory, file), err => {
        if (err) throw err;
      });
    }
  });

app.use(express.static(publicDir));

http.createServer(function (req, res) {
    if (req.url == '/fileupload') {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
        var oldpath = files.filetoupload.path;
        var newpath = '/home/clustrex-1/siddharth/oct-classification-service/test-image/1/' + files.filetoupload.name;
        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            imageDir = '1/'+ files.filetoupload.name;
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(sstring);
            res.write('<h3>Confirm Image:</h3><br><br>');
            res.write("<img alt = 'OCT' src='http://localhost:3000/" +imageDir+"' width=\"300\" height=\"300\" class='img-rounded'><br><br>");
            res.write('<a href = "http://localhost:3000" class="btn btn-warning" role="button">Confirm</a>');
            res.write(endstring);
            res.end();
        });
        });
    }
    else if(req.url == '/clear'){
        fs.readdir(directory, (err, files) => {
            if (err) throw err;
          
            for (const file of files) {
              fs.unlink(path.join(directory, file), err => {
                if (err) throw err;
              });
            }
          });
        res.writeHead(302,{'Location':'http://localhost:8081'});
        res.end();
    }
    else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(sstring);
        res.write('<div class="form-group">');
        res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
        res.write('<input type="file" class="form-control-file" name="filetoupload" aria-describedby="fileHelp"><br>');
        res.write('<input type="submit" class="btn btn-success btn-lg" value="Predict">');
        res.write('</form>');
        res.write('</div>')
        res.write(endstring);
        return res.end();
    }
}).listen(8081);

app.listen(3000, function() {
    console.log('server running on http://localhost:8081');
} )
app.get('', callName);

app.get('/result',function(req,res){
    res.setHeader('Content-Type', 'text/html');
    res.write(sstring);
    res.write(result);
    res.write('<br><br>');
    res.write('<a href = "http://localhost:8081/clear" class="btn btn-success" role="button">Continue</a>')
    res.write(endstring);
    res.end();
});
var loading ='<p>Predicting...<p>';
function callName(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.write(sstring);
    res.write(loading);
    var spawn = require("child_process").spawn;
    var process = spawn('python3',["./testOCTnonGPU.py"] );
    var op = '';
    process.stdout.on('data', function(data) {
        actualop = data.toString();
        op += "<h2>Predicted output:</h2> <br><br><h4>" + data.toString() +"</h4><br><br> <img alt = 'OCT' src='/" +imageDir+"' width=\"300\" height=\"300\" class='img-rounded'>";
    });
    process.stdout.on('end',function(){
        result = op;
        res.write('<a href = "http://localhost:3000/result" class="btn btn-info" role="button">Show Results!</a>');
        res.write(endstring);
        res.end();
    });
}