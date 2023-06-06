'use strict';
//import all packeges
const bodyParser = require('body-parser');
const express = require('express'); 
const cors = require('cors');
exports.validate = require('email-validator');
const app = express();
exports.xlsx = require('xlsx');
var http = require('http')
var path = require('path')
var session = require('express-session')
var cookeParser = require('cookie-parser')
var flash= require('connect-flash')
var errorHandler = require('errorhandler')
var expressLayouts = require('express-ejs-layouts')
var validator = require('express-validator')
var upload = require('express-fileupload')
exports.fs = require('fs')
var xlsx = require('xlsx')
const csv = require('fast-csv');
var multer = require('multer')
const uploadfile = multer({ dest: '../public/files/' })


// configuration for app 
app.use(cors({
    origin: '*'
}));
app.use(express.json());
app.use(upload());
app.set('view engine', 'ejs')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressLayouts)
// app.use(uploadfile.any());
app.use(express.static(path.join(__dirname, '../public/')))

//configuration for session
app.use(cookeParser('secret'))
app.use(
    session({
        cookie: { maxAge: 6000 },
        secret: 'secret',
        resave: false,
        saveUninitialized:true
    })
)
app.use(flash())

//call function routes
const routes = require('../routes/routes');
routes(app);    

// make server port with port
const port = process.env.PORT || 3000;  
app.listen(port, () => {
    console.log('Server berjalan di port '+port);
    console.log('Express server listening on port ' + port + ' =>  http://localhost:'+port)
});