const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connection = await mongoose.connect('mongodb+srv://rajdeepnagar08:C6fVS6MqMyFebNMI@cluster0.mxtaouw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { connectDB };
