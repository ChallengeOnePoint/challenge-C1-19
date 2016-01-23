// Load required packages
var Add = require('../models/cadresse');
var mongoose = require('mongoose');
var request = require("request")
var geocoder = require('geocoder');
// Create endpoint /api/echo for POSTS
exports.import = function(req, resm) {
  // Create a new instance

  var url = req.headers.url
  request({
      url: url,
      json: true
  }, function (error, response, body) {

      if (!error && response.statusCode === 200) {
          //console.log(body) // Print the json response
          for (var i = 0; i < body.length; i++) {
            element = body[i];
            var add = new Add();

            var location = new mongoose.Schema({
                loc: {
                type: [Number],  // [<longitude>, <latitude>]
                index: '2d'      // create the geospatial index
                }
            });
            var addtxt = ""+element.number+" "+element.street+" ,"+element.city;
            geocoder.geocode(addtxt, function ( err, dataloc ) {
              if(err){
                console.log(err);
              }else{
                var coords = [];

                coords[0] = dataloc.results[0].geometry.location.lng;
                coords[1] = dataloc.results[0].geometry.location.lat;
                location.loc = coords;

                add.location = location;
              }

              // Set the echo properties from POST data
              add._id = mongoose.Types.ObjectId();
              add.firstname = element.firstname;
              add.lastname = element.lastname;
              add.postcode = element.postcode;
              add.city = element.city;
              add.street = element.street;
              add.number = element.number;

              add.save(function(err) {
                if (err)
                  console.log(err);
              });
            });
          }
          User.find(function(err, users) {
            if (err){
              res.send(err);
              console.log(err);
            }
            console.log(users);
            res.json(users);
          });
      }
  })
};
