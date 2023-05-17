const express = require('express')
const app = express()
const path = require('path')
const hbs = require('express-handlebars')
const userRouter = require('./routes/user')
const adminRouter = require('./routes/admin')
require("dotenv").config()  //env file requiring

const mongoose = require('./config/connection')
var session = require('express-session')
var Handlebars = require('handlebars');
const helpers=require('./middleware/helper')

Handlebars.registerHelper("inc", function (value, options) {
    return parseInt(value) + 1;
});
app.set('view engine', 'hbs');

Handlebars.registerHelper('eq',function(arg1,arg2){
    return arg1==arg2;
})

app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', hbs.engine({
    extname: '.hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/layout/',
    partialsDir: __dirname + '/views/partials/',
 
}))




app.use(session({
    secret:process.env.SECRET_KEY , cookie: { maxAge: 6000000 }, resave: false,
    saveUninitialized: false
}))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', userRouter)
app.use('/', adminRouter)

app.use(express.static(path.join(__dirname, 'public')));
app.listen(3000, () => {
    console.log("server started")
})