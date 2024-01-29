const passport = require('passport'),
    LocalStrategy = require('passport-local'),
    Models = require('./models.js'),
    passportJWT = require('passport-jwt');

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

passport.use(
    new LocalStrategy(
        {
            usernameField: 'Username',
            passwordField: 'Password'
        },
        async (username, password, callback) => {
            console.log(`Attempting login with: ${username} ${password}`);
            try {
                const user = await Users.findOne({ Username: username });

                if (!user) {
                    console.log('Username not found');
                    return callback(null, false, { message: 'Incorrect username or password' });
                }

                if (!user.validatePassword(password)) {
                    console.log('Incorrect password');
                    return callback(null, false, { message: 'Incorrect password.' });
                }

                console.log('Login successful');
                return callback(null, user);
            } catch (error) {
                console.log('Error during login:', error);
                return callback(error);
            }
        }
    )
);

passport.use(
    new JWTStrategy(
        {
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            key: 'key'
        },
        async (jwtPayload, callback) => {
            try {
                const user = await Users.findById(jwtPayload._id);
                if (!user) {
                    return callback(null, false, { message: 'User not found' });
                }
                return callback(null, user);
            } catch (error) {
                console.error('Error in JWT authentication:', error);
                return callback(error, false);
            }
        }
    )
);
