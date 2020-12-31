// Express is a NPM Package (Nodejs Library) that helps in making web application development process easier

// Before running the app, do `npm install` in the command prompt

// To start the app use `npm start` in the command prompt and go to `localhost:3000` on the browser

const express = require('express'); // Import Express
const router = require('./routes');

const app = express(); // Create an Express App

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(router);

app.listen(3000, () => {
  console.log('App listening on port 3000!');
});
