// Express is a NPM Package (Nodejs Library) that helps in making web application development process easier

// Before running the app, do `npm install` in the command prompt

// To start the app use `npm start` in the command prompt and go to `localhost:3000` on the browser

const express = require('express'); // Import Express

const app = express(); // Create an Express App

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', (req, res, next) => {
  res.send('Hello World');
});

app.listen(3000, () => {
  console.log('App listening on port 3000!');
});
