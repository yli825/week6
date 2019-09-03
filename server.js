//Import packages
const express = require("express");
const mongodb = require("mongodb");
const bodyparser = require('body-parser');
const morgan = require('morgan');

const app = express();
let iurl = require('url');


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static('public'));
app.use(express.static('images'));

app.use(bodyparser.urlencoded({ extended: false }));
app.use(morgan('common'));
app.listen(8080);

const MongoClient = mongodb.MongoClient;

const url = "mongodb://localhost:27017/";

let db;

MongoClient.connect(url, { useNewUrlParser: true },
    function (err, client) {
        if (err) {
            console.log("Err  ", err);
        } else {
            console.log("Connected successfully to server");
            db = client.db("fit2095db");
            
        }
    });

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

app.post('/addnewtask', function (req, res) {
    let taskDetails = req.body;
    taskid=Math.round(Math.random()*1000000);
    db.collection('task').insertOne({TaskID:taskid,Taskname: taskDetails.taskname, assign_to: taskDetails.assignto, Due_date: taskDetails.duedate,task_status: taskDetails.taskstatus,task_description: taskDetails.taskdescription});
    res.redirect('/gettasks'); // redirect the client to list users page
});

app.get('/gettasks', function (req, res) {
    db.collectio ('task').find({}).toArray(function (err, data) {
        res.render('listtasks', { tasksDb: data });
    });
});

app.get('/updatetask', function (req, res) {
    res.sendFile(__dirname + '/views/updatetask.html');
});

app.post('/updatetaskdata', function (req, res) {
    let taskDetails = req.body;  
    let filter = {TaskID: parseInt(taskDetails.taskID)};
    
    let theUpdate = {$set:{task_status: taskDetails.taskstatus}};
    db.collection('task').updateOne(filter, theUpdate);
    res.redirect('/gettasks');// redirect the client to list users page
})





app.get('/deletetasks', function (req, res) {
    res.sendFile(__dirname + '/views/deletetasks.html');
});
app.post('/deletetaskdata', function (req, res) {
    let taskDetails = req.body;
    let filter = { TaskID: parseInt(taskDetails.taskID) };
    console.log(taskDetails)
    console.log(filter)

    db.collection('task').deleteOne(filter);
    res.redirect('/gettasks');// redirect the client to list users page
});
app.get('/deletealltasks', function (req, res) {
   
    db.collection('task').find({}).toArray(function (err, data) {
    res.render('deleteall', { tasksDb: data });
    })
});
app.post('/deletealldata', function (req, res) {
    db.collection('task').deleteMany({});
    res.redirect('/gettasks');// redirect the client to list users page
});


app.get('/insertMany', function (req, res) {
    res.sendFile(__dirname + '/views/insertMany.html');
});
app.post('/insertManydata', function (req, res) {
    let taskDetails = req.body;
    number=taskDetails.number
    
    var i;
    for (i = 0; i < number; i++) { 
        taskid=Math.round(Math.random()*1000000);
        db.collection('task').insertOne({TaskID:taskid,Taskname: taskDetails.taskname, assign_to: taskDetails.assignto, Due_date: taskDetails.duedate,task_status: taskDetails.taskstatus,task_description: taskDetails.taskdescription});

    } 
     
        
    res.redirect('/gettasks'); // redirect the client to list users page
});