const axios = require('axios');
const { MongoClient } = require('mongodb');
const apikey = '27169cc5e1a249c8980b9431f3ff70ad';
const sources = 'bbc-news';
const url = `http://newsapi.org/v2/top-headlines?sources=${sources}&apiKey=${apikey}`;

// Define the URL of the MongoDB database
const uri = 'mongodb://localhost:27017';

// Define the name of the database and the collection
const dbName = 'news';
const collectionName = 'articles';

// Connect to the MongoDB database
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');

    // Select the database and collection
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Fetch news articles from the News API
    axios.get(url)
      .then((response) => {
        let articles = response.data.articles;
        let documents = [];
        for (let art of articles) {
          documents.push({
            'title': art.title,
            'desc': art.description,
            'content': art.content,
            'publishedAt': new Date(art.publishedAt),
            'url': art.url,
            'image': art.urlToImage
          });
        }

        // Insert the news articles into the database
        collection.insertMany(documents)
          .then(() => {
            console.log('News articles inserted successfully');
            // Disconnect from the database
            client.close()
              .then(() => console.log('Disconnected from MongoDB'));
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  })
  .catch((err) => console.error(err));

