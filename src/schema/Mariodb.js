import mongoose from 'mongoose';

const Schema = mongoose.Schema;

var adminSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Admins', adminSchema);
