var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    "userId": String,
    "userName": String,
    "userPwd": String,
    "orderList": Array,
    "cartList": [{
        "productImage": String,
        "salePrice": String,
        "productName": String,
        "productId": String,
        "productNum": String,
        "checked": String
    }],
    "addressList":Array
});

module.exports = mongoose.model("User", userSchema, "users");
