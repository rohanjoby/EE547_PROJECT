const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3000;

// Enable JSON request body parsing
app.use(bodyParser.json());

// Define the route for the user registration API
app.post('/register', (req, res) => {
  // Extract the user information from the request body
  const { firstName, lastName, email, password } = req.body;
  console.log(firstName)
  console.log(lastName)
  console.log(email)
  console.log(password)
  // Connect to the MongoDB database
  MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    } else {
      // Select the users collection from the database
      const db = client.db('users');
      const collection = db.collection('users');

      // Insert the user document into the database
      const user = { firstName, lastName, email, password };
      collection.insertOne(user, (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: err.message });
        } else {
          res.status(201).json({ message: 'User created successfully' });
        }

        // Close the database connection
        client.close();
      });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
