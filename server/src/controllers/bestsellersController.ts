import { RequestHandler } from 'express';
import axios, { AxiosResponse } from 'axios';

import { redisGet, redisSet } from '../redis';

import Book from '../models/book';

interface scrapedBooks {
  name: string;
  cover: string;
}

const bestsellersController: RequestHandler = async (req, res, next) => {
  const booksObj: Book[] = [];
  var count: number = 0;

  const resp1: AxiosResponse = await axios.get(
    'https://go-books-scrapper.herokuapp.com/bestsellers'
  );
  const books = resp1.data.books as scrapedBooks[];

  loop1: for (var index: number = 0; index <= 36; index++) {
    // const URI = `http://openlibrary.org/search.json?title=${bestsellers[index]}`;

    const result = await redisGet(books[index].name);

    if (result) {
      booksObj.push(JSON.parse(result));
      // client.del(bestsellers[index]);
    } else {
      try {
        const bookName: string = books[index].name;
        var bookCover: string = books[index].cover.split('200').join('400');
        bookCover = bookCover.replace('SR400', 'SR270');
        const URI: string = `https://www.googleapis.com/books/v1/volumes?q=${bookName}&key=AIzaSyDGkA93rBrSUj0UQqvUA_9tuO6HPCB1QfY`;

        const encodedURI: string = encodeURI(URI);
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

        // if (book.volumeInfo.subtitle !== undefined) {
        //   newBook = new Book(
        //     book.id,
        //     title + book.volumeInfo.subtitle,
        //     authors,
        //     publishedDate,
        //     description,
        //     categories,
        //     pageCount,
        //     bookCover,
        //     averageRating
        //   );
        // } else {
        //   newBook = new Book(
        //     book.id,
        //     title,
        //     authors,
        //     publishedDate,
        //     description,
        //     categories,
        //     pageCount,
        //     bookCover,
        //     averageRating
        //   );
        // }

        booksObj.push(newBook);

        await redisSet(books[index].name, JSON.stringify(newBook));
      } catch (error) {
        console.error(error.message);
      }
    }

    // console.log(booksObj);
    count++;
  }
  console.log(`COUNT = ${count}`);
  res.json(booksObj);
};

export default bestsellersController;
