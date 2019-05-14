/* var connect = require('connect');
var serveStatic = require('serve-static');

connect().use(serveStatic(__dirname)).listen(8080, function(){
    console.log('Server running on 8080...');
}); */

// in sublime
var express = require('express');
var port = process.env.PORT || 3000;
var app = express();

var indexRouter = require("./index");

app.get('/', indexRouter);

app.listen(port, function () {
    console.log(`Example app listening on port !`);
});