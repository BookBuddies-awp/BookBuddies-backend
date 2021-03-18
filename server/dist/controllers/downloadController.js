"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const libgen = require('libgen');
const redis_1 = require("../redis");
const scraper_1 = __importDefault(require("../util/scraper"));
const downloadController = async (req, res, next) => {
    const bookTitle = req.query.title;
    const redisResult = await redis_1.redisGet(bookTitle + '-ddl');
    if (redisResult) {
        const resObject = JSON.parse(redisResult);
        return res.status(200).json(resObject);
    }
    else {
        try {
            const urlString = await libgen.mirror();
            console.log(`${urlString} is currently the fastest`);
            const options = {
                mirror: urlString,
                query: bookTitle,
                count: 5,
                sort_by: 'extension',
            };
            const queryResults = await libgen.search(options);
            // const parsedData = JSON.parse(data);
            var extension = '';
            var md5 = '';
            if (!queryResults.length || queryResults.length === 0) {
                return res.status(404).json({
                    message: 'No book found to download. Try again later.',
                });
            }
            for (const result of queryResults) {
                if (result.extension === 'epub') {
                    extension = 'epub';
                    md5 = result.md5;
                    break;
                }
                else if (result.extension === 'pdf') {
                    extension = 'pdf';
                    md5 = result.md5;
                    break;
                }
                else {
                    extension = 'invalid';
                    md5 = result.md5;
                }
            }
            const url = (await libgen.utils.check.canDownload(md5));
            const downloadLink = await scraper_1.default(url);
            const resObject = {
                download: downloadLink,
                url: url,
                extension,
                message: 'ok',
            };
            await redis_1.redisSet(bookTitle + '-ddl', JSON.stringify(resObject));
            return res.status(200).json(resObject);
        }
        catch (error) {
            console.error(error);
            return res.status(404).json({
                error: error.message,
            });
        }
    }
};
exports.default = downloadController;
//# sourceMappingURL=downloadController.js.map