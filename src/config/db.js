require('dotenv').config();
import mongoose from 'mongoose';

export default (callback) => {
  try {
    mongoose.set('useFindAndModify', false);
    mongoose.connect(
      process.env.DATABASE,
      {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true,
      },
      () => {
        console.log('connected to database');
      }
    );
  } catch (error) {
    console.log('ERROR: ', error.message);
  }
};
