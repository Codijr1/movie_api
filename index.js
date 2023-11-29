const express= require('express');
const http= require('http');
const fs= require('fs');
const path= require('path');
const app= express();
const port= 8080;
const morgan= require('morgan');
const server= http.createServer(app);
const mongoose= require('mongoose');
const Models= require('./models.js');
const Movies= Models.Movie;
const Users= Models.User;

mongoose.connect('mongodb://localhost:27017/MongoDB', { useNewUrlParser: true, useUnifiedTopology: true });

server.listen(port, () => {
  console.log(`Welcome to my server`);
});

app.use(morgan('combined'));

app.use((err, req, res, next)=> {
  console.error('Unexpected Error', err.stack);
  res.status(500).send('Unexpected Error');
});

app.get('/', (req, res)=> {
    const path = require('path');
    const indexPath = path.join(__dirname, 'index.html');
    res.sendFile(indexPath);
  console.log('Welcome to the home page');
});

app.get('/movies', (req, res)=> {
  const tenMovies= [
    { name: 'example', year: 2010 },
    { name: 'example2', year: 2011 },
    { name: 'example3', year: 2012 }
  ];
  res.json(tenMovies);
});

//paths for endpoints

app.get('/all-movies', (req, res) => {
  res.send('Returns a list of all movies');
});

app.get('/search-by-title', (req, res) => {
  res.send('Returns data on a specific movie by title');
});

app.get('/genres', (req, res) => {
  res.send('Returns data about a genre');
});

app.get('/directors', (req, res) => {
  res.send('Returns data about a director by name');
});

app.put('/register', (req, res) => {
  res.send('Allows a user to register');
});

app.post('/update-username', (req, res) => {
  res.send('Allows user to update their username');
});

app.put('/my-list-add', (req, res) => {
  res.send('Allows user to add a movie to their list of favorites');
});

app.delete('/my-list-delete', (req, res) => {
  res.send('Allows user to remove a movie from their list of favorites');
});

app.delete('/user-deregister', (req, res) => {
  res.send('Allows user to deregister');
});

app.use(express.static('public'));

