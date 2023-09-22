const express= require('express');
const http= require('http');
const fs= require('fs');
const path= require('path');
const app= express();
const port= 8080;
const morgan= require('morgan');
const server= http.createServer(app);


server.listen(port, () => {
  console.log(`Welcome to my server`);
});

app.use(morgan('combined'));

app.use((err, req, res, next)=> {
  console.error('Unexpected Error', err.stack);
  res.status(500).send('Unexpected Error');
});

app.get('/', (req, res)=> {
    const path = require('path');
    const indexPath = path.join(__dirname, 'index.html');
    res.sendFile(indexPath);
  console.log('Welcome to the home page');
});

app.get('/movies', (req, res)=> {
  const tenMovies= [
    { name: 'example', year: 2010 },
    { name: 'example2', year: 2011 },
    { name: 'example3', year: 2012 }
  ];
  res.json(tenMovies);
});

//paths for endpoints



app.use(express.static('public'));