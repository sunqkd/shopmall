// 商品列表
var mongoose = require('mongoose'); // 引入mongoose 
var Schema = mongoose.Schema; // 定义表模型

// 定义商品模型
var productSchema = new Schema({
    "productId": String,
    "productName": String,
    "salePrice": Number,
    "productNum":Number,
    "checked":String,
    "productImage": String
})

// 输出出去

module.exports = mongoose.model('Good',productSchema,'goods');