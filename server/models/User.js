import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: { type: String },
  timestamp: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'alumni'], required: true },
  batch_year: { type: Number, required: true },
  branch: { type: String, required: true },
  profile_picture: { type: String },
  linkedin_url: { type: String },
  current_position: { type: String },
  location: { type: String },
  messages: [messageSchema]
});

const User = mongoose.model('User', userSchema);
export default User;
