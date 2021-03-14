const libgen = require('libgen');
import { RequestHandler } from 'express';

import { redisGet, redisSet } from '../redis';
import scrapeURL from '../util/scraper';

interface downloadObj {
  download: string;
  url: string;
  extension: string;
  data: any[];
  message: string;
}

const downloadController: RequestHandler = async (req, res, next) => {
  const bookTitle = req.query.title as string;

  const redisResult = await redisGet(bookTitle + '-ddl');

  if (redisResult) {
    const resObject = JSON.parse(redisResult) as string;

    return res.status(200).json(resObject);
  } else {
    try {
      const urlString: string = await libgen.mirror();

      console.log(`${urlString} is currently the fastest`);

      const options = {
        mirror: urlString,
        query: bookTitle,
        count: 5,
        sort_by: 'extension',
      };

      const queryResults = await libgen.search(options);

      // const parsedData = JSON.parse(data);

      var extension: string = '';
      var md5: string = '';

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

      const url = (await libgen.utils.check.canDownload(md5)) as string;

      const downloadLink = await scrapeURL(url);

      const resObject: downloadObj = {
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

export default downloadController;
