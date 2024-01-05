const mongoose = require("mongoose");

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL,{ useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Database connected successfully!');
    } catch (error) {
        console.error('Failed to connect to the database:', error.message);
    }
};

module.exports = dbConnect;
