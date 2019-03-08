
/*********************************************************************************
* WEB322 – Assignment 06
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: __Rajan Gautam___ Student ID: __128485166_____ Date: __2018.11.23______
*
* Online (Heroku) Link: https://whispering-ridge-89239.herokuapp.com/
*
********************************************************************************/
var HTTP_PORT = process.env.PORT || 8080;


var express = require("express");
var path = require("path");
var app = express();

var multer = require("multer");
var fs = require('fs');
var exphbs = require("express-handlebars");

var clientSessions = require("client-sessions");
var bodyParser = require("body-parser");


app.use('/public', express.static(path.join(__dirname, 'public')));


app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

//helper functions

app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        navLink: function (url, options) {
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
}));


app.set('view engine', '.hbs');

app.use(function (req, res, next) {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});

function onHttpStart() {
    console.log("Express http server listening on port " + HTTP_PORT);
}

app.use(clientSessions({
    cookieName: "session",
    secret: "web322assignment6",
    duration: 2 * 60 * 1000,
    activeDuration: 1000 * 60
}));

app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});

function ensureLogin(req, res, next) {
    if (!req.session.user) {
        res.redirect("/login");
    } else {
        next();
    }
}

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});





function getFileListing() {
    return new Promise(function (resolve, reject) {
        var data = [];
        fs.readdir('public/images/uploaded', (err, items) => {
            for (var i = 0; i < items.length; i++) {
                data.push(items[i]);
            }
            if (err) {
                reject("there is an error");
            }
            resolve(data);
        });
    });
}



app.get("/", function (req, res) {
    res.render('home', {});
});

//Contacts
app.get("/Contact", function(req, res){
    res.render('Contact',{});
});
app.get("/about", function (req, res) {
    res.render('about', {});
});

