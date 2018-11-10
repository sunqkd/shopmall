var express = require('express');
var router = express.Router();

var mongoose = require('mongoose'); // 操作mongodb

var Goods = require('../models/goods.js');

// 连接数据库
mongoose.connect('mongodb://192.168.0.6:27017/db_demo');

mongoose.connection.on("connected", function () {
  console.log("连接成功")
})

mongoose.connection.on("error", function () {
  console.log("连接失败")
})

mongoose.connection.on("disconnected", function () {
  console.log("连接断开")
})


router.get("/", (req, res, next) => {
	// 查询数据库
	// find 两个参数 查找条件 回调
	let page = parseInt(req.param("page")) ; // 第几页
	let pageSize =parseInt(req.param("pageSize")) ; // 一页多少条数据
	let sort  =parseInt( req.param("sort")) ;// 前端传过来的参数
	let priceLevel = req.param("priceLevel"); // 价格过滤
	// console.log(page,pageSize,sort);
	let priceGt = ''; // 大于区间
	let priceLt = ''; // 小于区间
	let params = {}; // 查询条件
	
	if(priceLevel == 'all'){
		params = {};
	}else{
		switch (priceLevel){
			case '0':
				priceGt = 0;
				priceLt = 500;
				break;
			case '1':
				priceGt = 500;
				priceLt = 1000;
				break;
			case '2':
				priceGt = 1000;
				priceLt = 2000;
				break;
			case '3':
				priceGt = 2000;
				priceLt = 5000;
				break;
		}

		params = {
			salePrice:{
				$gt:priceGt,
				$lt:priceLt
			}
		}
	}
	
	let skip = (page - 1) * pageSize; // 分页公式


	
	let goodsModel = Goods.find(params).skip(skip).limit(pageSize);

	goodsModel.sort({'salePrice':sort});

	goodsModel.exec(function(err,doc){
		if(err){
			res.json({
				status:'1',
				msg: err.message
			})
		}else{
			res.json({
				status:'0',
				msg:'',
				result:{
					count:doc.length,
					list:doc
				}
			})
		}
	})


	// 普通查找
	// Goods.find({},function(err,doc){
	// 	if(err){
	// 		res.json({
	// 			status:'1',
	// 			msg: err.message
	// 		})
	// 	}else{
	// 		res.json({
	// 			status:'0',
	// 			msg:'',
	// 			result:{
	// 				count:doc.length,
	// 				list:doc
	// 			}
	// 		})
	// 	}
	// })

})

module.exports = router;
