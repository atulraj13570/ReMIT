// Import Firebase Admin SDK
const admin = require('firebase-admin');

// Initialize Firebase Admin with your service account credentials
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
  })
});

async function checkAlumniData() {
  try {
    const db = admin.firestore();
    const alumniRef = db.collection('Alumni');
    
    // Get all documents in the Alumni collection
    const snapshot = await alumniRef.get();
    
    if (snapshot.empty) {
      console.log('No alumni documents found in the collection.');
      return;
    }

    console.log(`Found ${snapshot.size} alumni documents:`);
    
    // Log each document's data
    snapshot.forEach(doc => {
      console.log(`\nDocument ID: ${doc.id}`);
      console.log('Document Data:', doc.data());
    });

  } catch (error) {
    console.error('Error checking alumni data:', error);
  }
}

checkAlumniData();
