// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var addc = require('./controllers/cadresse');
var crypto = require('crypto');
var fs = require('fs');
// Load data Schemas
var Add = require('./models/cadresse');
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/msg');

// Create our Express application
var app = express();

//var server = require('http').Server(app);
var privateKey  = fs.readFileSync('/etc/letsencrypt/live/dtccl.com/privkey.pem');
var certificate = fs.readFileSync('/etc/letsencrypt/live/dtccl.com/cert.pem');

var https = require('https');
var server = https.createServer({
    key: privateKey,
    cert: certificate
}, app);
// var http = require('http');
// var server = http.createServer(app);

var credentials = {key: privateKey, cert: certificate};
// Use body-parser
app.use(bodyParser.urlencoded({
  extended: true
}));

// Use environment defined port or 3000 443
var port = process.env.PORT || 3000;

// Create our Express router
var router = express.Router();
app.use('/', express.static(__dirname + '/public'));
// Create endpoint handlers for normal echo
router.route('/import')
  .get(addc.import);

// Start the server
server.listen(port);
// https.createServer({
//     key: privateKey,
//     cert: certificate
// }, app).listen(port);
console.log('it\'s aliiiive, nihaahaaaaaaa //// port: ' + port);
