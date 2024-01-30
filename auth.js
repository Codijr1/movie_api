const jwtSecret = process.env.JWTSECRET;
const jwt = require('jsonwebtoken');
const passport = require('passport');
const bcrypt = require('bcrypt');

require('./passport');

let generateJWTToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      Username: user.Username,
      FirstName: user.FirstName,
      LastName: user.LastName,
      Email: user.Email,
    },
    jwtSecret,
    {
      subject: user.Username,
      expiresIn: '30d',
      algorithm: 'HS256',
    }
  );
};

module.exports = (router) => {
  router.post('/login', async (req, res) => {
    //debug
    console.log('Received login request:', req.body);

    passport.authenticate('local', { session: false }, async (error, user, info) => {
      try {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: 'Internal server error' });
        }

        if (!user) {
          return res.status(400).json({
            message: 'Invalid credentials',
          });
        }

        const passwordMatch = await bcrypt.compare(req.body.Password, user.Password);

        if (!passwordMatch) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }

        req.login(user, { session: false }, (error) => {
          if (error) {
            throw error;
          }

          let token = generateJWTToken(user.toJSON());
          return res.json({ user, token });
        });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
      }
    })(req, res);
  });
};