var express = require('express');
var bodyparser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var app = express();
app.use(expressValidator());
var db = mongojs('M-Frikken:cl0udvisualizer@ds121349.mlab.com:21349/cloudpricetest', ['users']);
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

app.get('/users/node', function (req, res) {
    // var price= parseInt(req.body.price);
    // var price = JSON.stringify(req2.body.price);
    price = parseInt(req.query.price);
    var query = {price : {$lt: price}};
    res.set('Content-Type', 'application/json');
    db.users.find(query).pipe(JSONStream.stringify()).pipe(res);
    console.log('Finishing a get request');
});

app.post('/users/find', function(req, res){
    var price= parseInt(req.body.price);
    console.log(price);
    var query = {price : {$lt: price}};
    db.users.find(query,function (err, docs) {
        res.render('index',{
            title : 'Available packages',
            users: docs,
            price: price
        });
    });

    //Generating a JSON output file
/*    res.set('Content-Type', 'application/json');
    db.users.find(query).pipe(JSONStream.stringify()).pipe(res);*/

});


app.listen(process.env.PORT || 3000, function(){
    console.log('Server Started on Port 3000...');
});


/*

Mongo database
Starting mongod database:
sudo service mongod start
Accessing database manual:
    mongo --host 127.0.0.1:27017*/







/* Adding a entry to the database

app.post('/users/add', function(req, res){

    req.checkBody('first_name', 'First name is Required').notEmpty();
    req.checkBody('last_name', ' name is Required').notEmpty();
    req.checkBody('email', 'email is Required').notEmpty();

    var errors = req.validationErrors();

    if(errors){
        res.render('index',{
            title : 'Customers',
            users: users,
            errors: errors

        });
    }else{
        var newUser = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email
        };

        db.users.insert(newUser, function(err, result){
            if(err){
                console.log(err);
            }else{
                res.redirect('/');
            }
        });
        console.log('Success');
    }


});
*/

