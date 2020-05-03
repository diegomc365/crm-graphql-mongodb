const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env'});

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify :false,
            useCreateIndex: true
        });
        console.log('DB Mongo Atlas Connected')

    } catch(error) {
        console.log('Error');
        console.log(error);
        process.exit(1); //stop app
    }
}

module.exports = connectDB;