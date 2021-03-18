import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
console.log('*****');
console.log(`mongodb+srv://admin:OrZMVvj1iYTCyuTG@wooluck.c3ppg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`);
console.log('*****');
export default mongoose.connect(`mongodb+srv://admin:OrZMVvj1iYTCyuTG@wooluck.c3ppg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  function(err) {
    if (err) {
      console.error('mongodb connection error', err);
    }
    console.log('mongodb connected');
  }
);
