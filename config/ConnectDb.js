const mongoose = require('mongoose');

console.log('/////////////      Starting Mongo DB at :   ', (process.env.MONGO_URI || "mongodb://localhost:27017/image_processing"))
const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI || "mongodb://localhost:27017/image_processing"}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('Database connection error:', err.message);
        process.exit(1);
    }
}

module.exports = connectDB