const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const mongojs = require('mongojs');
const app = express();
const nodeFlags = require('node-flag');
const JSONStream = require('JSONStream');
const http = require('http');
const request = require('request');
const validateip = require('validate-ip');

// argument validation
if(process.argv.length <= 3){
    console.error("usage: node app.js -a [IP Address Cloudwatch]");
    process.exit(1);
} else {
    if( validateip(nodeFlags.get('a'))){
        var ipAddressCloudwatch = nodeFlags.get('a');
    } else {
        console.error("Please enter a valid IPv4 address");
        process.exit(1);
    }
}

// View Engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'webapp'));

//body parser middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

app.use(express.static('webapp/dist/'));

app.get('/index.html',function(req,res){
    res.render('index.html');
});

app.get('/about.html',function(req,res){
    res.render('about.html');
});

app.post('/cloudwatch',function(req,result){
    // retrieve service from request
    var service = req.body.service;

    var post_options = {
        host: ipAddressCloudwatch,
        port: '8000',
        path: '/api/v1',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    };

    var post_req = http.request(post_options, function(res) {
        var body = '';
        res.setEncoding('utf8');

        // receive data from cloudwatch
        res.on('data', function (chunk) {
           body += chunk;
        });

        // send data back to the client
        res.on('end', function(){
            result.send(body);
        });
    });

    post_req.write(JSON.stringify({
        'service' : service,
    }));
    post_req.end();

});

app.listen(process.env.PORT || 3000, function(){
    console.log('[INFO] Serving webpages from localhost:' + (process.env.PORT || 3000) );
    console.log('[INFO] Connected to cloudwatch ' + ipAddressCloudwatch );
});
