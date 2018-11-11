var express = require('express');
var router = express.Router();

var User = require('./../models/user.js');

/* GET users listing. */
router.get('/', function (req, res, next) {
  	res.send('respond with a resource');
});

// 登陆接口
router.post('/login',function(req,res,next){
	var param = {
		userName:req.body.userName, // 用户名
		userPwd:req.body.userPwd // 密码
	};
	
	// 操作数据库
	User.findOne(param,function(err,doc){
		if(err){
			res.json({
				status:"1",
				msg: err.message
			})
		}else{
			if(doc){
				// 做一些cookie 存取
				res.cookie("userId",doc.userId,{
					path:'/',
					maxAge:1000*60*60
				});
				res.cookie("userName",doc.userName,{
					path:'/',
					maxAge:1000*60*60
				});
				// req.session.user = doc;
				res.json({
					status:"0",
					msg:"",
					result:{
						userName:doc.userName
					}
				})
			}
		}
	})


})

// 登出接口
router.post("/loginout",function(req,res,next){
	res.cookie("userId","",{
		path:"/",
		maxAge:-1
	}) // 清空cookie
    res.json({
		status:"0",
		msg:'',
		result:''
	})
})

// 校验
router.get("/checkLogin",function(req,res,next){
	if(req.cookies.userId){  // 已经登录
		res.json({
			status:'0',
			msg:'已经登陆',
			result: req.cookies.userName || ""
		})
	}else{ // 未登录
		res.json({
			status: '1',
			msg:'未登录',
			result: ''
		})
	}
})


module.exports = router;
