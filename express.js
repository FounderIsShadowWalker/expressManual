var http = require('http');
var url = require('url');
var request = require('./request');
var response = require("./response");

var express = function(){
    var methods = ['get','post','delete','put','options','all'];

    var app = function (req, res) {
        var urlObj = url.parse(req.url, true);
        var pathname = urlObj.pathname;
        var method = req.method.toLowerCase();

        //找到匹配的路由
        //var route = app.routes.find(function(item){
        //    return (item.path === pathname || item.path === '*') && (item.method === method || method === 'all');
        //})
        //
        //if(route){
        //    route.fn(req,res);
        //}

        req.path = pathname;
        req.hostname = req.headers['host'].split(':')[0];
        req.query = urlObj.query;

        res.__proto__ = response;

        res.send = function (msg) {
            var type = typeof msg;
            if (type === 'string' || Buffer.isBuffer(msg)) {
                res.status(200).setHeader('content-type','text/html');
                res.end(msg);
            } else if (type === 'object') {
                res.setHeader('content-type','application/json');
                res.end(JSON.stringify(msg));
            } else if (type === 'number') {
                res.status(200).setHeader('content-type','text/plain').status(msg).
                res.end(_http_server.STATUS_CODES[msg]);
            }
        };


        var index = 0;
        function next(err){

            if(index >= app.routes.length){
                return res.end(`CANNOT  ${method} ${pathname}`);
            }

            var route = app.routes[index++];

            if(err) {
                if (route.method == 'middle' && route.fn.length == 4) {
                    route.fn(err, req, res, next);
                } else {
                    next(err);
                    return false;
                }
            }
                if (route.method == 'middle') {
                    if (route.path === "/" || pathname.startsWith(route.path + '/') || pathname === route.path) {
                        route.fn(req, res, next);
                    } else {
                        next();
                    }

                } else {
                    if(route.params) {
                        var matchers = pathname.match(new RegExp(route.path));
                        if (matchers) {
                            var params = {};
                            for (var i = 0; i < route.params.length; i++) {
                                params[route.params[i]] = matchers[i + 1];
                            }
                            req.params = params;
                            route.fn(req, res);
                        }else{
                            next();
                        }
                    }
                    else {
                        if ((route.path == pathname || route.path == '*') && (route.method == method || route.method == 'all')) {
                            route.fn(req, res);
                        } else {
                            next();
                        }
                    }
                }
        }
        next();
    }

    app.use = function(path, fn){
        if(typeof fn !== "function"){
            fn = path;
            path = '/';
        }
        app.routes.push({method:'middle',path:path,fn:fn});
    }

    app.listen = function(port){
        http.createServer(app).listen(port);
    }

    app.routes = [];

    methods.forEach(function(method){
        app[method] = function(path, fn){
            var config = {method:method,path:path,fn:fn};
            if(path.indexOf(":") > -1){
                var arr = [];
                config.path = path.replace(/:([^\/]+)/g, function(){
                    arr.push(arguments[1]);
                    return '([^\/]+)';
                });
                config.params = arr;
            }
            app.routes.push(config);
        }
    });

    return app;
};

module.exports = express;