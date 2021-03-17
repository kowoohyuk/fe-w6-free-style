import mongoose from 'mongoose';

export default function connection() {
  mongoose.connect('mongodb+srv://admin:dngur1202@wooluck.c3ppg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', 
    function(err) {
      if (err) {
        console.error('mongodb connection error', err);
      }
      console.log('mongodb connected');
    }
  );
}