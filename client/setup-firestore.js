const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function setupFirestore() {
  try {
    // Create sample alumni data
    const alumniData = [
      {
        name: "John Doe",
        email: "john.doe@example.com",
        batch_year: 2018,
        branch: "Computer Science",
        role: "alumni",
        profile_picture: "https://ui-avatars.com/api/?name=John+Doe",
        linkedin_url: "https://linkedin.com/in/johndoe",
        current_position: "Software Engineer",
        location: "Bangalore, India"
      },
      {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        batch_year: 2019,
        branch: "Electronics",
        role: "alumni",
        profile_picture: "https://ui-avatars.com/api/?name=Jane+Smith",
        linkedin_url: "https://linkedin.com/in/janesmith",
        current_position: "Product Manager",
        location: "Mumbai, India"
      },
      {
        name: "Bob Johnson",
        email: "bob.johnson@example.com",
        batch_year: 2017,
        branch: "Mechanical",
        role: "alumni",
        profile_picture: "https://ui-avatars.com/api/?name=Bob+Johnson",
        linkedin_url: "https://linkedin.com/in/bobjohnson",
        current_position: "Technical Lead",
        location: "Hyderabad, India"
      }
    ];

    // Add alumni data to Firestore
    const alumniCollection = collection(db, 'alumni');
    console.log('Adding sample alumni data to Firestore...');

    for (const alum of alumniData) {
      await addDoc(alumniCollection, {
        ...alum,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    console.log('Successfully added sample alumni data to Firestore!');
  } catch (error) {
    console.error('Error setting up Firestore:', error);
    process.exit(1);
  }
}

// Run the setup function
setupFirestore();
