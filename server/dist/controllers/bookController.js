"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const redis_1 = require("../redis");
const bookController = async (req, res, next) => {
    const bookId = req.query.id;
    // const URI = `https://www.googleapis.com/books/v1/volumes/vCbZs6eVYngC&key=AIzaSyDGkA93rBrSUj0UQqvUA_9tuO6HPCB1QfY`;
    const result = await redis_1.redisGet(bookId);
    if (result) {
        return res.json(JSON.parse(result));
    }
    else {
        const URI = `https://www.googleapis.com/books/v1/volumes/${bookId}`;
        const encodedURI = encodeURI(URI);
        // console.log(encodedURI);
        const response = await axios_1.default.get(encodedURI);
        res.json(response.data);
    }
};
exports.default = bookController;
//# sourceMappingURL=bookController.js.map