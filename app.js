
// THIS WORKS

/* var connect = require('connect');
var serveStatic = require('serve-static');

connect().use(serveStatic(__dirname)).listen(8080, function(){
    console.log('Server running on 8080...');
}); */


// THIS WORKS
var express = require('express');
var app = express();
const fileUpload = require('express-fileupload');

app.use(express.static(__dirname));
app.use(fileUpload());

// Handling File upload 
app.post('/upload', function(req, res) {
    
    if (Object.keys(req.files).length == 0) {
      return res.status(400).send('No files were uploaded.');
    }

    // Input Name
    let file = req.files.lessonFile;
    let fileName = file.name;

    // Move file to place
    file.mv('./file/' + fileName, function(err) {
        if (err){
            return res.status(500).send(err);
        }
    });

    res.send('File uploaded!');
    res.end();
});


var port = 8000;
app.listen(port);
console.log('server on ' + port);