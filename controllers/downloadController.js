const libgen = require('libgen');

const downloadController = async (req, res, next) => {
  try {
    const bookTitle = req.query.title;

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

    return res.json({
      download: `http://gen.lib.rus.ec/book/index.php?md5=${md5}`,
      url: url,
      data,
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = downloadController;
