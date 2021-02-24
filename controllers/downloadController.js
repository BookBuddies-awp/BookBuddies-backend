const libgen = require('libgen');
const scrapeURL = require('../util/scraper');
const { redisGet, redisSet } = require('../redis');

const downloadController = async (req, res, next) => {
  const bookTitle = req.query.title;

  const redisResult = await redisGet(bookTitle + '-ddl');

  if (redisResult) {
    const resObject = JSON.parse(redisResult);

    return res.status(200).json(resObject);
  } else {
    try {
      const urlString = await libgen.mirror();

      console.log(`${urlString} is currently the fastest`);

      const options = {
        mirror: urlString,
        query: bookTitle,
        count: 5,
      };

      const data = await libgen.search(options);

      // const parsedData = JSON.parse(data);

      const md5 = data[0].md5;

      const url = await libgen.utils.check.canDownload(md5);

      const downloadLink = await scrapeURL(url);

      const resObject = {
        download: downloadLink,
        url: url,
        message: 'ok',
      };

      await redisSet(bookTitle + '-ddl', JSON.stringify(resObject));

      return res.status(200).json(resObject);
    } catch (error) {
      console.error(error);
      return res.status(404).json({
        error: error.message,
      });
    }
  }
};

module.exports = downloadController;
