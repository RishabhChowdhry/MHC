const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');
const Joi = require('joi');

const db = require("./db");
const tbluser = "tbluser";
const tblrequest = "requests";
const tbldonation = "donations";
const app = express();

// schema used for data validation for our todo document
const schema = Joi.object().keys({
    todo : Joi.string().required()
});

// parses json data sent to us by the user 
app.use(bodyParser.json());

//html page redirection
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'user_login.html'));
});
app.get('/register',(req,res)=>{
    res.sendFile(path.join(__dirname,'user_register.html'));
});
app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'user_login.html'));
});
app.get('/userdashboard',(req,res)=>{
    res.sendFile(path.join(__dirname,'user_dashboard.html'));
});
app.get('/admindashboard',(req,res)=>{
    res.sendFile(path.join(__dirname,'admin_dashboard.html'));
});
app.get('/submitrequest',(req,res)=>{
    res.sendFile(path.join(__dirname,'submit_request.html'));
});
app.get('/viewrequest',(req,res)=>{
    res.sendFile(path.join(__dirname,'user_request_list.html'));
});
app.get('/viewrequestforadmin',(req,res)=>{
    res.sendFile(path.join(__dirname,'user_request_list_admin.html'));
});
app.get('/viewdonationlist',(req,res)=>{
    res.sendFile(path.join(__dirname,'view_donation_list.html'));
});

//send a email 
app.get('/sendemail/:id',(req,res)=>{
   var todoID = req.params.id;
   var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'h.ibrahimayub@gmail.com',
    pass: '00324ahmed'
  }
});

var mailOptions = {
  from: 'h.ibrahimayub@gmail.com',
  to: todoID,
  subject: 'Email Confirmation',
  html: 'Hello User Here Its Your Verify Email Link For Confirmation Please Click Here <br><a href="http://localhost:3000/login">Click Here</a>  '
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
     res.sendFile(path.join(__dirname,'check_your_email.html'));
  } else {
     res.sendFile(path.join(__dirname,'check_your_email.html'));
  }
});
});



//read user request
app.get('/getUserRequest',(req,res)=>{
    // get all Todo documents within our todo collection
    // send back to user as json
    db.getDB().collection(tblrequest).find({}).toArray((err,documents)=>{
        if(err)
            console.log(err);
        else{
            res.json(documents);
        }
    });
});
//read Ration /Donation
app.get('/getDonation',(req,res)=>{
    // get all Todo documents within our todo collection
    // send back to user as json
    db.getDB().collection(tbldonation).find({}).toArray((err,documents)=>{
        if(err)
            console.log(err);
        else{
            res.json(documents);
        }
    });
});

//update request status
app.put('/viewrequestforadmin/:id',(req,res)=>{
    // Primary Key of Todo Document we wish to update
    const todoID = req.params.id;
    // Document used to update
    const userInput = "Complete";
    // Find Document By ID and Update
    db.getDB().collection(tblrequest).findOneAndUpdate({_id : db.getPrimaryKey(todoID)},{$set : {requestatus : 'Complete'}},{returnOriginal : false},(err,result)=>{
        if(err)
            console.log(err);
        else{
            res.json(result);
        }      
    });
});

//submit donation
app.post('/submitdonation/:id',(req,res)=>{
    // Document to be inserted
    const todoID = req.params.id;
    const userInput = req.body;
    db.getDB().collection(tbldonation).insertOne(userInput,(err,result)=>{
                if(err){
                    console.log(err);

                }
                else
                    res.json({result : result, document : result.ops[0]});
            });
  
});

//create user
app.post('/register',(req,res)=>{
    // Document to be inserted
    const userInput = req.body;
    db.getDB().collection(tbluser).insertOne(userInput,(err,result)=>{
                if(err){
                    console.log(err);

                }
                else
                    res.json({result : result, document : result.ops[0]});
            });
  
});
//submit request
app.post('/submitrequest',(req,res)=>{
    // Document to be inserted
    const userInput = req.body;
    db.getDB().collection(tblrequest).insertOne(userInput,(err,result)=>{
                if(err){
                    console.log(err);

                }
                else
                    res.json({result : result, document : result.ops[0]});
            });
  
});





// Middleware for handling Error
// Sends Error Response Back to User
app.use((err,req,res,next)=>{
    res.status(err.status).json({
        error : {
            message : err.message
        }
    });
})


db.connect((err)=>{
    // If err unable to connect to database
    // End application
    if(err){
        console.log('unable to connect to database');
        process.exit(1);
    }
    // Successfully connected to database
    // Start up our Express Application
    // And listen for Request
    else{
        app.listen(3000,()=>{
            console.log('connected to database, app listening on port 3000');
        });
    }
});