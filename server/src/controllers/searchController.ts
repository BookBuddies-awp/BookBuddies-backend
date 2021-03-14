import { RequestHandler } from 'express';
import axios from 'axios';

import { redisGet, redisSet } from '../redis';
import Book from '../models/book';

const searchController: RequestHandler = async (req, res, next) => {
  const query = req.query.q as string;
  var booksObj: Book[] = [];

  const redisResult = await redisGet(query);

  if (redisResult) {
    booksObj = JSON.parse(redisResult);
    return res.json({ books: booksObj });
  } else {
    const URI = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=AIzaSyDGkA93rBrSUj0UQqvUA_9tuO6HPCB1QfY`;

    const encodedURI = encodeURI(URI);
    // console.log(encodedURI);

    const response = await axios.get(encodedURI);

    const responseItems = response.data;

    responseItems.items.forEach((book: any) => {
      if (book.volumeInfo.imageLinks === undefined) {
        return;
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

      const bookCover: string = book.volumeInfo.imageLinks.thumbnail;

      var newBook;

      // if (book.volumeInfo.subtitle !== undefined) {
      //   newBook = {
      //     id: book.id,
      //     title: book.volumeInfo.title + ': ' + book.volumeInfo.subtitle,
      //     authors: book.volumeInfo.authors,
      //     publishedDate: book.volumeInfo.publishedDate,
      //     description: book.volumeInfo.description,
      //     categories: book.volumeInfo.categories,
      //     pageCount: book.volumeInfo.pageCount,
      //     coverImage: book.volumeInfo.imageLinks.thumbnail,
      //     ratings: book.volumeInfo.averageRating,
      //   };
      // } else {
      //   newBook = {
      //     id: book.id,
      //     title: book.volumeInfo.title,
      //     authors: book.volumeInfo.authors,
      //     publishedDate: book.volumeInfo.publishedDate,
      //     description: book.volumeInfo.description,
      //     categories: book.volumeInfo.categories,
      //     pageCount: book.volumeInfo.pageCount,
      //     coverImage: book.volumeInfo.imageLinks.thumbnail,
      //     ratings: book.volumeInfo.averageRating,
      //   };
      // }

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
        newBook.title = newBook.title + book.volumeInfo.subtitle;
      }

      booksObj.push(newBook);
    });
    await redisSet(query, JSON.stringify(booksObj));
  }
  console.log(query);
  return res.json({ books: booksObj });
};

export default searchController;
