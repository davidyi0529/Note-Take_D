const express = require("express");
const fs = require("fs");
const path = require("path");
const dbH = require("./lib/dbHandler");
const bodyParser = require("body-parser");
const { v1: uuidv1} = require("uuid");

//Tells node that we are creating an "express" server
var app = express();

//Sets an initial port.
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// API routes
// Display API Notes
app.get('/api/notes', function(request, response) {
    let db = new dbH.dbHandler(path.join(__dirname,'db', 'db.json')); 
    let dataArray = JSON.parse(db.read());
    response.send(dataArray);
})

// Post API Notes
app.post('/api/notes', function(request, response) {
    let db = new dbH.dbHandler(path.join(__dirname, 'db', 'db.json'));
    let dataArray = JSON.parse(db.read());
    let newNote = request.body;
    newNote.id = uuidv1();
    dataArray.push(newNote);
    db.write(JSON.stringify(dataArray));
    response.send('200');
})

// Delete API Notes
app.delete('/api/notes/:id', function(request, response) {
    let db = new dbH.dbHandler(path.join(__dirname,'db', 'db.json'));
    let dataArray = JSON.parse(db.read());
    let id = request.params.id;
    dataArray = dataArray.filter(value => value.id != id);
    db.write(JSON.stringify(dataArray));
    response.send('200');
})

// HTML routes
// notes.html
app.get('/notes', function(request, response) {
    response.sendFile(path.join(__dirname, 'public', 'notes.html'))
})

// index.html
app.get('*', function(request, response) {
    response.sendFile(path.join(__dirname, 'public', 'index.html'))
})

//Listener that starts our server
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });