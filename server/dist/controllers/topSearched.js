"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const redis_1 = require("../redis");
const topSearchedController = async (req, res, next) => {
    const booksObj = [];
    var count = 0;
    const resp1 = await axios_1.default.get('https://go-books-scrapper.herokuapp.com/top-searched');
    const books = resp1.data.books;
    loop1: for (let index = 0; index <= 10; index++) {
        // const URI = `http://openlibrary.org/search.json?title=${bestsellers[index]}`;
        const result = await redis_1.redisGet(books[index].name);
        if (result) {
            booksObj.push(JSON.parse(result));
            // client.del(bestsellers[index]);
        }
        else {
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
            var newBook;
            if (book.volumeInfo.subtitle !== undefined) {
                newBook = {
                    id: book.id,
                    title: book.volumeInfo.title + ': ' + book.volumeInfo.subtitle,
                    authors: book.volumeInfo.authors,
                    publishedDate: book.volumeInfo.publishedDate,
                    description: book.volumeInfo.description,
                    categories: book.volumeInfo.categories,
                    pageCount: book.volumeInfo.pageCount,
                    coverImage: bookCover,
                    ratings: book.volumeInfo.averageRating,
                };
            }
            else {
                newBook = {
                    id: book.id,
                    title: book.volumeInfo.title,
                    authors: book.volumeInfo.authors,
                    publishedDate: book.volumeInfo.publishedDate,
                    description: book.volumeInfo.description,
                    categories: book.volumeInfo.categories,
                    pageCount: book.volumeInfo.pageCount,
                    coverImage: bookCover,
                    ratings: book.volumeInfo.averageRating,
                };
            }
            booksObj.push(newBook);
            await redis_1.redisSet(books[index].name, JSON.stringify(newBook));
        }
        // console.log(booksObj);
        count++;
    }
    console.log(`COUNT = ${count}`);
    res.json(booksObj);
};
exports.default = topSearchedController;
//# sourceMappingURL=topSearched.js.map