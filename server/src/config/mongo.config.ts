import mongoose from 'mongoose';

export const mongoConfig = () => {
  const uri = process.env.MONGO_URI || '';

  mongoose.Promise = Promise;
  mongoose.connect(uri);
  mongoose.connection.on('error', (error: Error) => console.log(error));
  mongoose.connection.on('open', () => console.log('connected to mongoDB'));
};
