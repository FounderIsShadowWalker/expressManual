var express = require('express');
var app = express();
app.use(function (req,res,next) {
    console.log('过滤石头');
    next();
});
app.use('/PPPP', function (req,res,next) {
    console.log('过滤沙子');
    next();
});
app.get('/water', function (req,res) {
    res.end('water');
});
app.listen(3000);