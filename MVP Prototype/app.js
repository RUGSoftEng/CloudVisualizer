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
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
const nodeFlags = require('node-flag')

/*
var logger = function (req,res,next){
    console.log('Logging...');
    next();
};

app.use(logger);
*/

console.log("Trying to connect to the 'Cloudwatch API' via address " + nodeFlags.get('a'));

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'webapp'));


//body parser middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));

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

app.use(express.static('webapp/dist/'));

app.get('/index.html',function(req,res){
    res.render('index.html');
    //__dirname : It will resolve to your project folder.
});

app.get('/about.html',function(req,res){
    res.render('about.html');
    //res.sendFile(path.join(__dirname+'about.html'));
});

app.get('/users3', function (req, res) {
    res.set('Content-Type', 'application/json');
    db2.googlepricelist.find({}, {"gcp_price_list":1}).pipe(JSONStream.stringify()).pipe(res);
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