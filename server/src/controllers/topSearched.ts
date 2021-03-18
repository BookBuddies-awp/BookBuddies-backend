import { RequestHandler } from 'express';
import axios from 'axios';

import { redisGet, redisSet } from '../redis';
import Book from '../models/book';

const topSearchedController: RequestHandler = async (req, res, next) => {
  const booksObj = [];
  var count = 0;

  const resp1 = await axios.get(
    'https://go-books-scrapper.herokuapp.com/top-searched'
  );
  const books = resp1.data.books;

  loop1: for (let index = 0; index <= 10; index++) {
    // const URI = `http://openlibrary.org/search.json?title=${bestsellers[index]}`;

    const result = await redisGet(books[index].name);

    if (result) {
      booksObj.push(JSON.parse(result));
      // client.del(bestsellers[index]);
    } else {
      const bookName = books[index].name;
      var bookCover: string = books[index].cover.split('200').join('400');
      bookCover = bookCover.replace('SR400', 'SR270');
      const URI = `https://www.googleapis.com/books/v1/volumes?q=${bookName}&key=AIzaSyDGkA93rBrSUj0UQqvUA_9tuO6HPCB1QfY`;

      const encodedURI = encodeURI(URI);
      // console.log(encodedURI);

      const resp2 = await axios.get(encodedURI);
      const respObj = resp2.data;
      const book = respObj.items[0];

      if (book.volumeInfo.imageLinks === undefined) {
        continue loop1;
      }

      const {
        title,
        authors,
        publishedDate,
        description,
        categories,
        pageCount,
        averageRating,
      } = book.volumeInfo;

      var newBook: Book;

      newBook = new Book(
        book.id,
        title,
        authors,
        publishedDate,
        description,
        categories,
        pageCount,
        bookCover,
        averageRating
      );

      if (book.volumeInfo.subtitle !== undefined) {
        newBook.title = newBook.title + ': ' + book.volumeInfo.subtitle;
      }
      booksObj.push(newBook);

      await redisSet(books[index].name, JSON.stringify(newBook));
    }

    // console.log(booksObj);
    count++;
  }
  console.log(`COUNT = ${count}`);
  res.json(booksObj);
};

export default topSearchedController;
