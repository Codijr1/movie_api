const mongoose =require('mongoose');
let movieSchema= mongoose.Schema({
    Title:{type:String, required:true},
    Description:{type:String, required:true},
    Genre:{
        Name: String,
        Description: String

    },
    Director:{
        Name: String,
        Description: String
    },
    Actors: [String],
    ImagePath:String,
    Featured:Boolean
});

let Movie=mongoose.model('Movie', movieSchema);
let User=mongoose.model('User', userSchemas);

module.exports.Movie=Movie;
module.exports.User=User;