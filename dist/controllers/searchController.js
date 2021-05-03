"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const redis_1 = require("../redis");
const book_1 = __importDefault(require("../models/book"));
const searchController = async (req, res, next) => {
    const query = req.query.q;
    var booksObj = [];
    const redisResult = await redis_1.redisGet(query);
    if (redisResult) {
        booksObj = JSON.parse(redisResult);
        return res.json(booksObj);
    }
    else {
        const URI = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=AIzaSyDGkA93rBrSUj0UQqvUA_9tuO6HPCB1QfY`;
        const encodedURI = encodeURI(URI);
        // console.log(encodedURI);
        const response = await axios_1.default.get(encodedURI);
        const responseItems = response.data;
        responseItems.items.forEach((book) => {
            if (book.volumeInfo.imageLinks === undefined) {
                return;
            }
            const { title, authors, publishedDate, description, categories, pageCount, averageRating, } = book.volumeInfo;
            var bookCover = book.volumeInfo.imageLinks.thumbnail;
            bookCover = bookCover.replace('http', 'https');
            var newBook;
            newBook = new book_1.default(book.id, title, authors, publishedDate, description, categories, pageCount, bookCover, averageRating);
            if (book.volumeInfo.subtitle !== undefined) {
                newBook.title = newBook.title + ': ' + book.volumeInfo.subtitle;
            }
            booksObj.push(newBook);
        });
        await redis_1.redisSet(query, JSON.stringify(booksObj));
    }
    console.log(query);
    return res.json(booksObj);
};
exports.default = searchController;
//# sourceMappingURL=searchController.js.map