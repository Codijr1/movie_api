const express = require('express');
const http = require('http');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
const app = express();
const server = http.createServer(app);
const port = 8080;


// const Genres = Models.Genre;
// const Directors = Models.Director;

mongoose.connect('mongodb://0.0.0.0:27017/MongoDB', {});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
  server.listen(port, () => {
    console.log(`Welcome to my server.`);
  });
});

app.use(morgan('combined'));

app.use((err, req, res, next) => {
  console.error('Unexpected Error', err.stack);
  res.status(500).send('Unexpected Error');
});

//page endpoints start here

app.get('/', (req, res) => {
  const path = require('path');
  const indexPath = path.join(__dirname, 'index.html');
  res.sendFile(indexPath);
  console.log('Welcome to the home page');
});

app.get('/movies', async (req, res) => {
  try {
    const movies = await Movies.find();
    res.json(movies);
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: 'Error' });
  }
});

app.get('/search-by-title', async (req, res) => {
  const title = req.query.title;
  try {
    const movie = await Movies.findOne({ Title: title });
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ error: 'Error' });
    }
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: 'Error' });
  }
});

app.get('/genres', async (req, res) => {
  try {
    const genres = await Genres.find();
    res.json(genres);
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: 'Error' });
  }
});

app.get('/directors', async (req, res) => {
  const directorName = req.query.name;
  try {
    const director = await Directors.findOne({ 'Name': directorName });
    if (director) {
      res.json(director);
    } else {
      res.status(404).json({ error: 'Error' });
    }
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: 'Error' });
  }
});

app.put('/register', async (req, res) => {
  const { Username, Password, Email, Birthday } = req.body;
  try {
    const newUser = new Users({ Username, Password, Email, Birthday });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: 'Error' });
  }
});

app.post('/update-username', async (req, res) => {
  const { oldUsername, newUsername } = req.body;
  try {
    const user = await Users.findOneAndUpdate({ Username: oldUsername }, { Username: newUsername }, { new: true });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'Error' });
    }
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: 'Error' });
  }
});

app.put('/my-list-add', async (req, res) => {
  const { Username, MovieID } = req.body;
  try {
    const user = await Users.findOneAndUpdate({ Username }, { $push: { FavoriteMovies: MovieID } }, { new: true });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'Error' });
    }
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: 'Error' });
  }
});

app.delete('/my-list-delete', async (req, res) => {
  const { Username, MovieID } = req.body;
  try {
    const user = await Users.findOneAndUpdate({ Username }, { $pull: { FavoriteMovies: MovieID } }, { new: true });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'Error' });
    }
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: 'Error' });
  }
});

app.delete('/user-deregister', async (req, res) => {
  const { Username } = req.body;
  try {
    const user = await Users.findOneAndDelete({ Username });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'Error' });
    }
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: 'Error' });
  }
});

app.use(express.static('public'));