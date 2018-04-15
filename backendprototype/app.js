var express = require('express');
var bodyparser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var app = express();
app.use(expressValidator());
var db = mongojs('M-Frikken:cl0udvisualizer@ds121349.mlab.com:21349/cloudpricetest', ['users']);
var db2 = mongojs('M-Frikken:cl0udvisualizer@ds121349.mlab.com:21349/cloudpricetest', ['googlepricelist']);
var JSONStream = require('JSONStream');
/*
var logger = function (req,res,next){
    console.log('Logging...');
    next();
};

app.use(logger);
*/


// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


//body parser middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));


/// Set Static Path
app.use(express.static(path.join(__dirname, 'public')));

///Global Vars
app.use(function(req,res,next){
    res.locals.errors = null;
    res.locals.price = 70;
    res.locals.price2=75;
    return next();
});


// Express Validtor Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value){
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;
        while(namespace.length){
            formParam += '[' + namespace.shift() + ']' ;
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }

}));

app.get('/', function(req,res){
    var query = {};
    db.users.find(query,function (err, docs) {
        res.render('index',{
            title : 'Available packages',
            users: docs
        });
    });
});

app.get('/users', function (req, res) {
    price = parseInt(req.query.price);
    var query = {price : {$lt: price}};
    res.set('Content-Type', 'application/json');
    db.users.find(query,{price:1}).pipe(JSONStream.stringify()).pipe(res);
});

app.get('/users2', function (req, res) {
    //substring=req.query.substring;
    res.set('Content-Type', 'application/json');
    db.googlepricelist.aggregate({
        $project: {
            "gcp_price_list_as_array": { $objectToArray: "$gcp_price_list" }, // transform "gcp_price_list" into an array of key-value pairs
        }
    }, {
        $unwind: "$gcp_price_list_as_array" // flatten array
    }, {
        $match: { "gcp_price_list_as_array.k": new RegExp(req.query.substring) } // like filter on the "k" (as in "key") field using regular expression
    }).pipe(JSONStream.stringify()).pipe(res);

});

app.get('/users3', function (req, res) {
    //substring=req.query.substring;
    res.set('Content-Type', 'application/json');
    /*var pricelist=db.googlepricelist.gcp_price_list.find({},{});
    pricelist.pipe(JSONStream.stringify()).pipe(res); */
    db.googlepricelist.find({}, {"gcp_price_list":1}).pipe(JSONStream.stringify()).pipe(res);
});


app.post('/users/find', function(req, res){
    var price= parseInt(req.body.price);
    //console.log(price);
    var query = {price : {$lt: price}};
    db.users.find(query,function (err, docs) {
        res.render('index',{
            title : 'Available packages',
            users: docs,
            price: price
        });
    });
});


app.listen(process.env.PORT || 3000, function(){
    console.log('Server Started on Port 3000...');
});