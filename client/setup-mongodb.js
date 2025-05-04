require('dotenv').config();
const mongoose = require('mongoose');

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/carrier-portal';

// User schema
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
  messages: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function setupDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Create sample alumni data
    const alumniData = [
      {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // hashed password
        role: "alumni",
        batch_year: 2018,
        branch: "Computer Science",
        profile_picture: "https://ui-avatars.com/api/?name=John+Doe",
        linkedin_url: "https://linkedin.com/in/johndoe",
        current_position: "Software Engineer",
        location: "Bangalore, India"
      },
      {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
        role: "alumni",
        batch_year: 2019,
        branch: "Electronics",
        profile_picture: "https://ui-avatars.com/api/?name=Jane+Smith",
        linkedin_url: "https://linkedin.com/in/janesmith",
        current_position: "Product Manager",
        location: "Mumbai, India"
      },
      {
        name: "Bob Johnson",
        email: "bob.johnson@example.com",
        password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
        role: "alumni",
        batch_year: 2017,
        branch: "Mechanical",
        profile_picture: "https://ui-avatars.com/api/?name=Bob+Johnson",
        linkedin_url: "https://linkedin.com/in/bobjohnson",
        current_position: "Technical Lead",
        location: "Hyderabad, India"
      }
    ];

    // Insert sample data
    console.log('Adding sample alumni data to MongoDB...');
    await User.insertMany(alumniData);

    console.log('Successfully added sample alumni data to MongoDB!');

    // Close the connection
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error setting up MongoDB:', error);
    process.exit(1);
  }
}

// Run the setup function
setupDatabase();
