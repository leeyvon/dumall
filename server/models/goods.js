var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
    'productId':String,
    'productName':String,
    'salePrice':Number,
    'checked':String,
    'productName':String,
    'productImage':String,
    'productNum':Number
});

module.exports = mongoose.model('Good',productSchema);
