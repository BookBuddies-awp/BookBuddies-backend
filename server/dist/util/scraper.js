"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = __importDefault(require("cheerio"));
const axios_1 = __importDefault(require("axios"));
const scrapeURL = async (url) => {
    const { data } = await axios_1.default.get(url);
    console.log('Scraping ' + url);
    const $ = cheerio_1.default.load(data);
    const cloudflareLink = $('#download > ul > li:nth-child(3) > a').attr('href');
    return cloudflareLink;
};
exports.default = scrapeURL;
//# sourceMappingURL=scraper.js.map