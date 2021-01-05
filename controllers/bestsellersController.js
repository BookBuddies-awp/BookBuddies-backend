const axios = require('axios').default;

const bestsellersController = async (req, res, next) => {
  const booksObj = [];
  var count = 0;

  const resp1 = await axios.get('http://localhost:3000/bestsellers');
  const bestsellers = resp1.data.books;

  loop1: for (let index = 0; index <= 16; index++) {
    // const URI = `http://openlibrary.org/search.json?title=${bestsellers[index]}`;
    const URI = `https://www.googleapis.com/books/v1/volumes?q=${bestsellers[index]}&key=AIzaSyDGkA93rBrSUj0UQqvUA_9tuO6HPCB1QfY`;

    const encodedURI = encodeURI(URI);
    console.log(encodedURI);

    const resp2 = await axios.get(encodedURI);
    const respObj = resp2.data;
    const book = respObj.items[0];

    if (book.volumeInfo.imageLinks === undefined) {
      continue loop1;
    }

    booksObj.push({
      id: book.id,
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors,
      publishedDate: book.volumeInfo.publishedDate,
      description: book.volumeInfo.description,
      pageCount: book.volumeInfo.pageCount,
      coverImage: book.volumeInfo.imageLinks.thumbnail,
      ratings: book.volumeInfo.averageRating,
    });

    console.log(booksObj);
    count++;
  }
  console.log(count);
  res.json(booksObj);
};

module.exports = bestsellersController;
