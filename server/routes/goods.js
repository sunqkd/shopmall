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

// 查询商品列表
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

});


var User = require('../models/user.js');

// 加入购物车
router.post("/addCart",(req,res,next)=>{
	var userId = "100000077"; // 假设已经登陆 用户id
	var productId = req.body.productId; // 商品id
	User.findOne({userId:userId},(err,userdoc)=>{
		if(err){
			res.json({
				status:"1",
				msg:err.message
			})
		}else{
			// console.log(userdoc);
			if(userdoc){
				let goodsItem = ''; // 
				userdoc.cartList.forEach((item)=>{
					if(item.productId == productId){ // 说明已经添加过此商品 之要求数量上加一就可
						goodsItem = item; // 把这条信息保存起来
						item.productNum++;
					}
				})

				if(goodsItem){  // 表示购物车中已经有此商品
					userdoc.save(function(err,doc){ // 跟新数据库
						if(err){
							res.json({
								status:'1',
								msg:err.message
							})
						}else{
							res.json({
								status:'0',
								msg:'',
								result:'增加商品 数量成功'
							})
						}
					})

				}else{ // 表示购物车里面没有此试商品  需要添加新的商品
					Goods.findOne({productId:productId},function(err1,gooddoc){
						if(err1){
							res.json({
								status:"1",
								msg:err1.message
							})
						}else{
							if(gooddoc){
								// 如果goods 数据库中不存在 下面的字段 则不会保存到goods数据库中
								gooddoc.productNum = 1; // 加一个数量单位 默认为1
								gooddoc.checked = 1; // 选中状态
	
								// 加入到数据库中
								userdoc.cartList.push(gooddoc);
								userdoc.save(function(err2,doc2){
									if(err2){
										res.json({
											status:"1",
											msg:err2.message
										})
									}else{
										res.json({
											status:"0",
											msg:'',
											result:'添加新商品 成功'
										})
									}
								})
							}
						}
					})
				}

				
			}
		}
	})

})

module.exports = router;
