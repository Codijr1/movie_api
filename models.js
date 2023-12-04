const mongoose =require('mongoose');

let movieSchema= mongoose.Schema({
    Title:{type:String, required:true},
    Year:{type:Number, required:true},
    Description:{type:String, required:true},
    Genre:{Name: String},
    Director:{Name: String},
});

let userSchema=mongoose.Schema({
    FirstName:{type:String, required:true},
    LastName:{type:String, required:true},
    Email:{type:String, required:true},
    Birthday:Date,
    Username:{type:String, required:true}
});

let Movie=mongoose.model('Movie', movieSchema);
let User=mongoose.model('User', userSchema);

let genreSchema = mongoose.Schema({
    Name: String,
    Description: String
});

let directorSchema = mongoose.Schema({
    Name: String,
    Bio: String
});

let Genre = mongoose.model('Genre', genreSchema);
let Director = mongoose.model('Director', directorSchema);

module.exports.Genre = Genre;
module.exports.Director = Director;
module.exports.Movie=Movie;
module.exports.User=User;


