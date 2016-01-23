/**************************************************
Author: Sidi Mohamed Jeilany.
contact: sidimed.jeilany@gmail.com
***************************************************/

var mongoose = require('mongoose');

var LocationSchema = new mongoose.Schema({
    loc: {
    type: [Number],  // [<longitude>, <latitude>]
    index: '2d'      // create the geospatial index
    }
});
var addSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, // Elt ID (it is better an safer to use native mongo ids)
    firstname: String,
    lastname: String,
    postcode: Number,
    city: String,
    street: String,
    number: Number,
    location: LocationSchema,
});
module.exports = mongoose.model('CAdresse',addSchema);
