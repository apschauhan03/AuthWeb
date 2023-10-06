// const express = require('express');
// const app = express();


// function middleware1(req,res,next){
//     console.log('I am middle ware 1');
//     req.ApsEmail = 'abhijitchau8948@gmail.com';
//     next();
// }
// function middleware2(req,res,next){
//     console.log(`The first email id is : ${req.ApsEmail}`);
//     req.ApsEmail = 'abhijitchau9919@gmail.com';
//     next();
// }
// function standardFirstFunction(req,res,next){
//     res.send(`the second email id is : ${req.ApsEmail}`);
//     next();
// }
// function errorHandler(err,req,res,next){
//     if(err){
//         res.send("<h1>There was a error!</h1>");
//     }
// }
// app.use(middleware1);
// app.use(middleware2);
// app.get('/',standardFirstFunction);
// app.use(errorHandler);
// app.listen(3300);


const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');


var app = express();

//Connecting the mongodb database
const dbString = "mongodb://localhost:27017/newDatabase";
const dbOptions = {
    useNewUrlParser : true,
    useUnifiedTopology : true
}
const connection = mongoose.createConnection(dbString,dbOptions);

app.use(express.json());
app.use(express.urlencoded({extended:true}));


//connection of mongoDb to session
const sessionStore =  MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/newDatabase',
    collection:'sessions'
});

app.use(session({
    secret:'my secret',
    resave:false,
    saveUninitialized:true,
    store:sessionStore,
    cookie:{
        maxAge:1000*60*60*24
    }
}));

app.get('/',(req,res,next)=>{
    if(req.session.viewCount){
        req.session.viewCount++;
    }
    else
    {
        req.session.viewCount = 1;
    }
    res.send(`<h1>You have visited this site ${req.session.viewCount} number of times</h1>`);
})

app.listen(3300);