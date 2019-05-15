/* var connect = require('connect');
var serveStatic = require('serve-static');

connect().use(serveStatic(__dirname)).listen(8080, function(){
    console.log('Server running on 8080...');
}); */


/* const express = require('express');
const app = new express();

app.get('/', function(request, response){
    response.sendfile('index.html');
}); */


var express = require('express');
var app = express();
app.use(express.static(__dirname));
var port = 8000; // you can use any port
app.listen(port);
console.log('server on ' + port);