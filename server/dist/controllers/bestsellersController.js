"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const redis_1 = require("../redis");
const book_1 = __importDefault(require("../models/book"));
const bestsellersController = async (req, res, next) => {
    const booksObj = [];
    var count = 0;
    const resp1 = await axios_1.default.get('https://go-books-scrapper.herokuapp.com/bestsellers');
    const books = resp1.data.books;
    loop1: for (var index = 0; index <= 36; index++) {
        // const URI = `http://openlibrary.org/search.json?title=${bestsellers[index]}`;
        const result = await redis_1.redisGet(books[index].name);
        if (result) {
            booksObj.push(JSON.parse(result));
            // client.del(bestsellers[index]);
        }
        else {
            try {
                const bookName = books[index].name;
                var bookCover = books[index].cover.split('200').join('400');
                bookCover = bookCover.replace('SR400', 'SR270');
                const URI = `https://www.googleapis.com/books/v1/volumes?q=${bookName}&key=AIzaSyDGkA93rBrSUj0UQqvUA_9tuO6HPCB1QfY`;
                const encodedURI = encodeURI(URI);
                // console.log(encodedURI);
                const resp2 = await axios_1.default.get(encodedURI);
                const respObj = resp2.data;
                const book = respObj.items[0];
                if (book.volumeInfo.imageLinks === undefined) {
                    continue loop1;
                }
                const { title, authors, publishedDate, description, categories, pageCount, averageRating, } = book.volumeInfo;
                var newBook;
                newBook = new book_1.default(book.id, title, authors, publishedDate, description, categories, pageCount, bookCover, averageRating);
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
                await redis_1.redisSet(books[index].name, JSON.stringify(newBook));
            }
            catch (error) {
                console.error(error.message);
            }
        }
        // console.log(booksObj);
        count++;
    }
    console.log(`COUNT = ${count}`);
    res.json(booksObj);
};
exports.default = bestsellersController;
//# sourceMappingURL=bestsellersController.js.map