const axios = require('axios').default;
const { redisGet, redisSet } = require('../redis');

const topSearchedController = async (req, res, next) => {
  const booksObj = [];
  var count = 0;

  const resp1 = await axios.get(
    'https://go-books-scrapper.herokuapp.com/top-searched'
  );
  const books = resp1.data.books;

  loop1: for (let index = 0; index <= 8; index++) {
    // const URI = `http://openlibrary.org/search.json?title=${bestsellers[index]}`;

    const result = await redisGet(books[index]);

    if (result) {
      booksObj.push(JSON.parse(result));
      // client.del(bestsellers[index]);
    } else {
      const URI = `https://www.googleapis.com/books/v1/volumes?q=${books[index]}&key=AIzaSyDGkA93rBrSUj0UQqvUA_9tuO6HPCB1QfY`;

      const encodedURI = encodeURI(URI);
      // console.log(encodedURI);

      const resp2 = await axios.get(encodedURI);
      const respObj = resp2.data;
      const book = respObj.items[0];

      if (book.volumeInfo.imageLinks === undefined) {
        continue loop1;
      }

      const newBook = {
        id: book.id,
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors,
        publishedDate: book.volumeInfo.publishedDate,
        description: book.volumeInfo.description,
        pageCount: book.volumeInfo.pageCount,
        coverImage: book.volumeInfo.imageLinks.thumbnail,
        ratings: book.volumeInfo.averageRating,
      };

      booksObj.push(newBook);

      await redisSet(books[index], JSON.stringify(newBook));
    }

    // console.log(booksObj);
    count++;
  }
  console.log(`COUNT = ${count}`);
  res.json(booksObj);
};

module.exports = topSearchedController;
