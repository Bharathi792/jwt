var jwt = require('jsonwebtoken');

const express = require('express')
const app = express()
const port = 5000
var bodyParser = require('body-parser')
const mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');
require('mongoose-type-email');
app.use(bodyParser.urlencoded({ extended: false }))
mongoose.connect('mongodb+srv://user1:1234@cluster0.cgoi5.mongodb.net/user', {useNewUrlParser: true, useUnifiedTopology: true});
const userschema = new mongoose.Schema(
{
   firstname: String,
   lastname: String,
   mailid: mongoose.SchemaTypes.Email,
   password: String,
   dob:String,
   phonenumber:Number
});
const secret = "this is the secret"
userschema.plugin(encrypt, { secret: secret ,encryptedFields: ["password"]});
const User =new mongoose.model("User", userschema)
app.post('/register', function (req, res) {
const newuser = new User(
  {
    firstname: req.body.firstname,
    lastname:req.body.lastname ,
    mailid: req.body.mailid,
    password: req.body.password,
    dob:req.body.dob,
    phonenumber:req.body.phonenumber
    });
    newuser.save();

res.send('you are logged in')

})
app.post('/login',function(req,res){
const firstname = req.body.firstname
const password = req.body.password
User.findOne({firstname: firstname} ,function(err,foundUser){
if(foundUser){
if(foundUser.password == password){
      const foundData = foundUser.toJSON();
      const accesstoken = jwt.sign(foundData,'hakflahflahfls644fdsafa55fd5as5f')
      res.send(accesstoken)
  }
    else
    res.send ("no user found")
}
else
res.send ("no user found")
} )
})

app.get('/login/data',auth,function (req,res){
  res.send("success")
})
function auth(req,res,next){
  try
  {
    const decoded = jwt.verify (req.body.token,'hakflahflahfls644fdsafa55fd5as5f')
    next();
  }
  catch(error){
    res.send ("authentication failed")
}

}

app.listen(port, function()  {
  console.log(`server started`)
})
