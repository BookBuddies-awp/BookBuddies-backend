import { RequestHandler } from 'express';
import axios from 'axios';

import { redisGet, redisSet } from '../redis';

const bookController: RequestHandler = async (req, res, next) => {
  const bookId = req.query.id as string;

  // const URI = `https://www.googleapis.com/books/v1/volumes/vCbZs6eVYngC&key=AIzaSyDGkA93rBrSUj0UQqvUA_9tuO6HPCB1QfY`;
  const result = await redisGet(bookId);

  if (result) {
    return res.json(JSON.parse(result));
  } else {
    const URI = `https://www.googleapis.com/books/v1/volumes/${bookId}`;

    const encodedURI = encodeURI(URI);
    // console.log(encodedURI);

    const response = await axios.get(encodedURI);

    res.json(response.data);
  }
};

export default bookController;
