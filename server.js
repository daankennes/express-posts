const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');

app.listen(process.env.PORT || 4000, () => {
  console.log('Listening on port 4000');
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));

// Redirect to posts
app.get('/', (req, res) => {
   res.redirect('/posts');
});

// List all posts
app.get('/posts', (req, res) => {
  request('http://jsonplaceholder.typicode.com/posts', function(err, reqres, body) {
    
    let json = JSON.parse(body);
    console.log(json[0]);
    res.render('posts.ejs', {posts: json});
  });
});

// Show the search form
app.get('/search', (req, res) => {
   res.render('search.ejs', { post: '' });
});

// Find all comments for post
app.post('/search', (req, res) => {
  request('http://jsonplaceholder.typicode.com/posts', function(err, reqres, body) {
    let json = JSON.parse(body);
    let postId = "";
    for (let x = 0; x < json.length; x++){
      if (json[x].body.name == json[x].name) postId = json[x].id;
    }
    console.log(postId);
    request('http://jsonplaceholder.typicode.com/comments', function(newerr, newreqres, newbody) {
      let newjson = JSON.parse(newbody);
      let response = [];
      for (let x = 0; x < newjson.length; x++){
        if (newjson[x].postId == postId) response.push(newjson[x]);
      }
      console.log(response);
      res.render('search_result.ejs', {comments: response});
    });
  });
});
