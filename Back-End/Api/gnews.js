const axios = require('axios');
const apikey='c4423886d381833f33956fcc40ca47f0'
const category='general'
const lang='en'
const country='us'
const max='10'
const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017/";
const dbName = "news";

// Connect to MongoDB database
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');
    const collectionName = "articles";
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    var url=`https://gnews.io/api/v4/top-headlines?category=${category}&lang=${lang}&country=${country}&max=${max}&apikey=${apikey}`;

    axios.get(url)
      .then((response)=>{
        let document=[]
        let articles=response.data.articles;
        for(let art of articles){
            document.push({'title': art.title, 
            'desc': art.description, 
            'content': art.content, 
            'publishedAt': art.publishedAt, 
            'url': art.url,
            'image': art.image})
        }
        // console.log(document)

        // Insert the news articles into the database
        collection.insertMany(document)
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