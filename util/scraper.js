const cheerio = require('cheerio');
const axios = require('axios');

const scrapeURL = async (url) => {
  const { data } = await axios.get(url);

  console.log('Scraping ' + url);
  const $ = cheerio.load(data);

  const cloudflareLink = $('#download > ul > li:nth-child(1) > a').attr('href');

  return cloudflareLink;
};

module.exports = scrapeURL;
