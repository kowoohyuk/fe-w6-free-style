import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export default mongoose.connect(`mongodb+srv://admin:${process.env.DB_PASSWORD}@wooluck.c3ppg.mongodb.net/memotree?retryWrites=true&w=majority`, 
  function(err) {
    if (err) {
      console.error('mongodb connection error', err);
    }
    console.log('mongodb connected');
  }
);
