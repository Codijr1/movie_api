/**
 * Express application setup with CORS, JSON, and URL-encoded middleware.
 * @module app
 */

const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Configure CORS to allow specified origins.
 * @constant
 */

const cors = require('cors');
let allowedOrigins = [
  'http://localhost:1234',
  'http://localhost:4200',
  'https://myflixproject-9c1001b14e61.herokuapp.com',
  'https://myflixprojectcjr.netlify.app',
  'https://codijr1.github.io',
  'https://codijr1.github.io/myFlix-angular-app',
  'https://codijr1.github.io/myFlix-Angular-client',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    let message = 'The CORS policy for this application does not allow access from origin ' + origin;
    return callback(new Error(message), false);
  }
}));
app.use(express.static('public'));
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

/**
 * Creates an HTTP server to listen for incoming requests.
 * @constant
 */

const http = require('http');
const path = require('path');

/**
 * HTTP request logging middleware.
 * @constant
 */

const morgan = require('morgan');
const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;
const server = http.createServer(app);
const port = process.env.PORT || 8080;

/**
 * Start the Express.js server.
 */
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});

const { check, validationResult } = require('express-validator');

//https://myflixproject-9c1001b14e61.herokuapp.com/

/**
 * Establish a connection to MongoDB.
 * @constant
 */

//for online api
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//for local host
// mongoose.connect('mongodb://0.0.0.0:27017/MongoDB', {});

/**
 * Database connection and error handling.
 * @constant
 */

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(morgan('combined'));

app.use((err, req, res, next) => {
  console.error('Unexpected Error', err.stack);
  res.status(500).send('Unexpected Error');
});

//page endpoints start here

/**
 * Sends the index.html file for the home page.
 * @route GET /
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 */
app.get('/', (req, res) => {
  const path = require('path');
  const indexPath = path.join(__dirname, 'index.html');
  res.sendFile(indexPath);
  console.log('Welcome to the home page');
});

/**
 * Retrieves all movies.
 * @route GET /movies
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @returns {Array<Object>} A list of movies.
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movies = await Movies.find();
    res.json(movies);
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: 'Error' });
  }
});

/**
 * Retrieves a specific movie by title.
 * @route GET /movies/:Title
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @returns {Object} The movie object.
 */
app.get('/movies/:Title',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ title: req.params.Title })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

/**
 * Retrieves all users.
 * @route GET /users
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @returns {Array<Object>} A list of users.
 */
app.get('/users',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const users = await Users.find();
      res.json(users);
    } catch (error) {
      console.error('Error', error);
      res.status(500).json({ error: 'Error' });
    }
  });

/**
* Retrieves a specific user by username.
* @route GET /users/:Username
* @param {express.Request} req - The request object.
* @param {express.Response} res - The response object.
* @returns {Object} The user object.
*/
app.get('/users/:Username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

/**
 * Retrieves a list of all genres.
 *
 * @route GET /genres
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @returns {Array<Object>} A list of genre objects.
 *
 * @throws Will return an error with status 500 if there's an internal server error.
 */
app.get('/genres',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const genres = await Genres.find();
      res.json(genres);
    } catch (error) {
      console.error('Error', error);
      res.status(500).json({ error: 'Error' });
    }
  });

/**
* Retrieves a specific genre by name.
*
* @route GET /genres/:Name
* @param {express.Request} req - The request object, containing the genre name.
* @param {string} req.params.Name - The name of the genre to retrieve.
* @param {express.Response} res - The response object.
* @returns {Object} The genre object if found.
*
* @throws Will return an error with status 500 if there's an internal server error.
*/
app.get('/genres/:Name',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Genres.findOne({ Name: req.params.Name })
      .then((genres) => {
        res.json(genres);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

/**
 * Retrieves a list of all directors.
 *
 * @route GET /directors
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @returns {Array<Object>} A list of director objects.
 *
 * @throws Will return an error with status 500 if there's an internal server error.
 */
app.get('/directors', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const directors = await Directors.find();
    res.json(directors);
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: 'Error' });
  }
});

/**
 * Retrieves a specific director by name.
 *
 * @route GET /directors/:Name
 * @param {express.Request} req - The request object, containing the director's name as a parameter.
 * @param {string} req.params.Name - The name of the director to retrieve.
 * @param {express.Response} res - The response object.
 * @returns {Object} The director object if found.
 * 
 * @throws Will return an error with status 500 if there's an internal server error.
 */
app.get('/directors/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Directors.findOne({ Name: req.params.Name })
    .then((directors) => {
      res.json(directors);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//commands to manipulate data

/**
 * Signs up a new user.
 * @route POST /signup
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @returns {Object} The newly created user object.
 */
app.post('/signup', [
  check('Username', 'Username is required').isLength({ min: 5 }),
  check('Username', 'Username contains non alphanumeric characters').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email is not valid').isEmail()
], async (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  let hashedPassword = Users.hashPassword(req.body.Password);
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
            Password: hashedPassword,
            Email: req.body.Email
          })
          .then((user) => { res.status(201).json(user) })
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

/**
 * Updates a user's information.
 * @route PUT /users/:Username
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @returns {Object} The updated user object.
 */
app.put('/users/:Username',
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email is not valid').isEmail()
  ],
  passport.authenticate('jwt', { session: false }), async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send('Permission denied');
    }
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
      $set:
      {
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email
      }
    },
      { new: true })
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error:' + err);
      })
  });

/**
 * Deletes a user by their username.
 * @route DELETE /users/:Username
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 */
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndDelete({ Username: req.params.Username })
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

/**
 * Adds a movie to a user's favorites list.
 *
 * @route POST /users/:Username/movies/:movieId
 * @param {express.Request} req - The request object, containing the user's username and the movie ID.
 * @param {string} req.params.Username - The username of the user.
 * @param {string} req.params.movieId - The ID of the movie to be added to the favorites list.
 * @param {express.Response} res - The response object.
 * @returns {Object} The updated user object with the new favorite movie.
 * 
 * @throws Will return an error with status 500 if there's an internal server error.
 */
app.post('/users/:Username/movies/:movieId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      console.log('Request Params:', req.params);
      const updatedUser = await Users.findOneAndUpdate(
        { Username: req.params.Username },
        { $push: { favoriteMovies: req.params.movieId } },
        { new: true }
      );
      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error:' + err);
    }
  });

// deletes a movie from a users favorites list
app.delete('/users/:Username/movies/:movieId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    console.log('Request Params:', req.params);
    const updatedUser = await Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { favoriteMovies: req.params.movieId } },
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error:' + err);
  }
});