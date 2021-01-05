const axios = require('axios').default;

const { redisGet, redisSet } = require('../redis');

const searchController = async (req, res, next) => {
  const query = req.query.q;
  const booksObj = [];

  const redisResult = await redisGet(query);

  if (redisResult) {
    console.log('REDIS');
    return res.json(JSON.parse(redisResult));
  } else {
    console.log('GOOGLE');

    const URI = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=AIzaSyDGkA93rBrSUj0UQqvUA_9tuO6HPCB1QfY`;

    const encodedURI = encodeURI(URI);
    // console.log(encodedURI);

    const response = await axios.get(encodedURI);

    const responseItems = response.data;

    responseItems.items.forEach((book) => {
      if (book.volumeInfo.imageLinks === undefined) {
        return;
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
    });
    await redisSet(query, JSON.stringify(booksObj));
  }
  console.log(query);
  return res.json(booksObj);
};

module.exports = searchController;
