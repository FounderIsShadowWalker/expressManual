var express = require('./express');

var app = express();

//app.set('view engine','html')
//app.set('views',path.join(__dirname,'views'));
//app.engine('html',require('ejs').__express);

app.use(function(req, res ,next){
    console.log("过滤石头");
    next();
})
app.use('/hello', function(req, res, next){
    console.log("过滤沙子");
    next();
});
//app.use(function (err,req,res,next) {
//     res.end(err);
//});
app.get('/', function (req,res) {
    res.render('hello',{title:'hello'},function(err,data){});
});

app.get('/hello/:id/:name/:home/:age', function (req, res) {
    console.log(req.params);
    res.end('hello');
});

app.get('/world', function(req, res){
    res.end('world');
});

app.get('/json', function (req,res) {
    res.send({obj:1});
});

app.get("*", function (req,res) {
    res.setHeader('content-type','text/plain;charset=utf8');
    res.end('没有找到匹配的路径');
});
app.post('/hello', function (req,res) {
    res.end('hello');
});
app.post('*', function (req,res) {
    res.end('post没找到');
});



app.listen(3000);