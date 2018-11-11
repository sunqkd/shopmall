var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goodsRouter = require('./routes/goods');

var ejs = require('ejs'); // 引入ejs
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express); // 设置html后缀
app.set('view engine', 'html'); // jade 改为 html

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// 捕获登陆
app.use(function(req,res,next){
    if(req.cookies.userId){ // 说明已经登陆
		next(); // 继续向后走
	}else{
		console.log(`${req.path} --- ${req.originalUrl}`);
		if(req.originalUrl == '/users/login' || req.originalUrl == '/users/loginout' || req.path =='/goods/list'){
			next();
		}else{
			res.json({
				status:"10001",
				msg:'当前未登录',
				result:''
			})
		}
	}

});


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/goods', goodsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
