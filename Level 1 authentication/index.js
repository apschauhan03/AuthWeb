//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");Level 2 encryption
//Level 3 encryption
const md5 = require("md5");

const app = express();
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({
    extended:true
}));

//Connection through database
mongoose.connect("mongodb://localhost:27017/UserDB", {useNewUrlParser:true});
const UserSchema = new mongoose.Schema( {
    userName : String,
    password : String
});

//Level 2 Encryption
// UserSchema.plugin(encrypt, { encryptionKey: process.env.ENCKEY, signingKey: process.env.SIGKEY,encryptedFields:["password"] });

//Creating a model
const User = new mongoose.model("User",UserSchema);



app.get("/",(req,res)=>{
    res.render("home");
});
app.get("/login",(req,res)=>{
    res.render("login");
});
//After login
app.post("/login",(req,res)=>{
    const credential_email = req.body.username;
    const credential_password = md5(req.body.password);

    User.findOne({userName:credential_email}).then((foundOne)=>{
        if(foundOne.password === credential_password)
        {
            res.render("secrets");
        }
        else
        {
            res.render("UserNotFound");
        }
    }).catch((err)=>
    {
        console.log(err);
    }
    )
})




app.get("/register",(req,res)=>{
    res.render("register");
});
//After registering
app.post("/register",(req,res)=>{
   
    const newUser = new User({
        userName : req.body.username,
        password : md5(req.body.password)
    });

    newUser.save().then((savedUser) => {
        // The user was saved successfully.
        res.render("secrets");
      }, (err) => {
        // An error occurred while saving the user.
        console.log(`Error saving user: ${err}`);
      });
});

app.listen(3000,()=>{
    console.log("Server started at port 3000");
});