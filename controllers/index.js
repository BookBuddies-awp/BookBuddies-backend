const axios = require('axios').default;
const cheerio = require('cheerio');

exports.home = (req, res, next) => {
  axios.get('http://localhost:3000/bestsellers').then((response) => {
    // $('#zg-ordered-list').each((i, item) => {
    //   console.log($(`li:nth-child(${i+1}) > span > div > span > a > div'`)[0]['children'][0]['data'])
    // })

    // const ol = $('#zg-ordered-list').children();

    // ol.each((i, item) => {
    //   console.log($('span > div > span > a > div')[0]['children'][0]['data']);
    // });

    // for (let index = 0; index <= 6; index++) {
    //   console.log(
    //     $(
    //       `#zg-ordered-list > li:nth-child(${
    //         index + 1
    //       }) > span > div > span > a > div`
    //     ).text()
    //   );
    // }
    const bestsellers = response.data.books;

    axios
      .get(`http://openlibrary.org/search.json?title=${bestsellers[0]}`)
      .then((resp) => {
        res.json(resp.data);
      });
  });
  // res.send('Hello');
};
