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
        sort_by: 'extension',
      };

      const queryResults = await libgen.search(options);

      // const parsedData = JSON.parse(data);

      var extension;

      for (const result of queryResults) {
        if (result.extension === 'epub') {
          extension = 'epub';
          md5 = result.md5;
          break;
        } else if (result.extension === 'pdf') {
          extension = 'pdf';
          md5 = result.md5;
          break;
        } else {
          extension = 'invalid';
          md5 = result.md5;
        }
      }

      // if (queryResults.find((result) => result.extension))
      // const index = queryResults.findIndex(
      //   (element) => element.extension === extension
      // );

      // console.log(index);

      // const md5 = queryResults[0].md5;

      console.log(md5);

      const url = await libgen.utils.check.canDownload(md5);

      const downloadLink = await scrapeURL(url);

      const resObject = {
        download: downloadLink,
        url: url,
        extension,
        data: queryResults,
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
