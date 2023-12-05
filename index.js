const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const http = require('http');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;
const server = http.createServer(app);
const port = 8080;


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

//movies
app.get('/movies', async (req, res) => {
  try {
    const movies = await Movies.find();
    res.json(movies);
  } catch (error){
    console.error('Error',error);
    res.status(500).json({error:'Error'});
  }
});
app.get('/movies/:Title', (req, res)=>{
  Movies.findOne({title: req.params.Title})
    .then((movie) =>{
      res.json(movie);
    })
    .catch((err) =>{
      console.error(err);
      res.status(500).send('Error: '+ err);
    });
});

//users
app.get('/users', async (req, res) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (error){
    console.error('Error',error);
    res.status(500).json({error:'Error'});
  }
});
app.get('/users/:Username', (req, res)=>{
  Users.findOne({username: req.params.Username})
    .then((user) =>{
      res.json(user);
    })
    .catch((err) =>{
      console.error(err);
      res.status(500).send('Error: '+ err);
    });
});

//genres
app.get('/genres', async (req, res) => {
  try {
    const genres = await Genres.find();
    res.json(genres);
  } catch (error){
    console.error('Error',error);
    res.status(500).json({error: 'Error'});
  }
});
app.get('/genres/:Name', (req, res)=>{
  Genres.findOne({Name: req.params.Name})
    .then((genres) =>{
      res.json(genres);
    })
    .catch((err) =>{
      console.error(err);
      res.status(500).send('Error: '+ err);
    });
});

//directors
app.get('/directors', async (req, res) => {
  try {
    const directors = await Directors.find();
    res.json(directors);
  } catch (error){
    console.error('Error',error);
    res.status(500).json({error: 'Error'});
  }
});
app.get('/directors/:Name', (req, res)=>{
  Directors.findOne({Name: req.params.Name})
    .then((directors) =>{
      res.json(directors);
    })
    .catch((err) =>{
      console.error(err);
      res.status(500).send('Error: '+ err);
    });
});

//commands to manipulate data

//Add a user
app.post('/users', async (req, res) => {
  await Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            Username: req.body.Username,
            Email: req.body.Email
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//updates a user's info
app.put('/users/:Username', async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      Username: req.body.Username,
      Email: req.body.Email
    }
  },
  { new: true }) // This line makes sure that the updated document is returned
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error:' + err);
  })

});
// app.post('/update-username', async (req, res) => {
//   const { oldUsername, newUsername } = req.body;
//   try {
//     const user = await Users.findOneAndUpdate({ Username: oldUsername }, { Username: newUsername }, { new: true });
//     if (user) {
//       res.json(user);
//     } else {
//       res.status(404).json({error:'Error' });
//     }
//   } catch (error) {
//     console.error('Error', error);
//     res.status(500).json({ error:'Error'});
//   }
// });

//adds a movie to a user's favorites list
app.post('/users/:Username/movies/:MovieID', async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }) // This line makes sure that the updated document is returned
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error:' + err);
  });
});

// app.put('/my-list-add', async (req, res) => {
//   const { Username, MovieID } = req.body;
//   try {
//     const user = await Users.findOneAndUpdate({ Username }, { $push: { FavoriteMovies: MovieID } }, { new: true });
//     if (user) {
//       res.json(user);
//     } else {
//       res.status(404).json({error:'Error'});
//     }
//   } catch (error) {
//     console.error('Error',error);
//     res.status(500).json({error:'Error'});
//   }
// });

//deletes a movie from a user's favorites list

app.delete('/my-list-delete', async (req, res) => {
  const { Username, MovieID } = req.body;
  try {
    const user = await Users.findOneAndUpdate({ Username }, { $pull: { FavoriteMovies: MovieID } }, { new: true });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error:'Error'});
    }
  } catch (error) {
    console.error('Error',error);
    res.status(500).json({error:'Error'});
  }
});

//deletes a user by username
app.delete('/users/:Username', async (req, res) => {
  await Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
// app.delete('/user-deregister', async (req, res) => {
//   const { Username } = req.body;
//   try {
//     const user = await Users.findOneAndDelete({ Username });
//     if (user) {
//       res.json(user);
//     } else {
//       res.status(404).json({ error: 'Error' });
//     }
//   } catch (error) {
//     console.error('Error', error);
//     res.status(500).json({ error: 'Error' });
//   }
// });



app.use(express.static('public'));