const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;


// Enable JSON request body parsing
app.use(bodyParser.json());

// Define a dummy user database


//this part should come from mongodb server
const users = [
  { username: 'john', password: 'doe' },
  { username: 'jane', password: 'smith' }
];

// Define the route for the login API
app.post('/login', (req, res) => {
  // Extract the username and password from the request body
  const { username, password } = req.body;

  // Check if the user exists and the password is correct
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    // If the authentication is successful, return a JWT token
    const token = 'someJWTtoken';
    res.json({ token });
  } else {
    // If the authentication fails, return an error message
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
