passport.use(
    new LocalStrategy(
        {
            usernameField: 'Username', // Specify the field name for the username
            passwordField: 'Password', // Specify the field name for the password
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
