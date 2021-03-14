// Express is a NPM Package (Nodejs Library) that helps in making web application development process easier

// Before running the app, do `npm install` in the command prompt

// To start the app use `npm start` in the command prompt and go to `localhost:3000` on the browser

// const express = require('express');// Import Express

import express, { Express, urlencoded, json } from 'express';
import helmet from 'helmet';

import router from './routes/index';

import tokenChecker from './middlewares/tokenChecker';

const app: Express = express(); // Create an Express App

app.use(urlencoded({ extended: false }));
app.use(json());
app.use(helmet());
app.use(tokenChecker);

app.use(router);

const PORT: string = process.env.PORT || '8080';

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
