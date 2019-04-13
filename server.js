console.log('starting server');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');
var models = require("./models");
var dotenv = require('dotenv');
var helmet = require('helmet');
dotenv.load();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));

app.use(helmet({
    frameguard: false,
    noSniff: true,
    noCache: true,
    xssFilter: true
}));


require('./app/routes/routes')(app);

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

models.sequelize.sync().then(function() {
    app.listen(process.env.PORT, function() {});
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err
    });
});


//app.listen(config.port);
console.log('Server started and listening on port ' + process.env.PORT);
