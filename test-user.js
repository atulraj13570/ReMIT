const axios = require('axios');

const testUser = {
    name: "Test User",
    email: "testuser@example.com",
    password: "testpassword123",
    role: "alumni",
    batch_year: 2020,
    branch: "Computer Science",
    profile_picture: "https://ui-avatars.com/api/?name=Test+User",
    linkedin_url: "https://linkedin.com/in/testuser",
    current_position: "Software Engineer",
    location: "Mumbai"
};

axios.post('http://localhost:5000/api/users/register', testUser)
    .then(response => {
        console.log('User registered successfully!');
        console.log('Response:', response.data);
    })
    .catch(error => {
        console.error('Error registering user:', error.response?.data || error.message);
    });
