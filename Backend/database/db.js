const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Dotenv
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

const connectToDB = () => {
    mongoose.connect(MONGO_URI)
        .then((res) => {
            console.log("Database Connected Successfully");
        })
        .catch((error) => {
            console.log(error.message);
        });
}

module.exports = connectToDB;