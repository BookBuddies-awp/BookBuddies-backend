import cheerio from 'cheerio'
import axios from 'axios'

const scrapeURL = async (url: string): Promise<string> => {
  const { data } = await axios.get(url);

  console.log('Scraping ' + url);
  const $ = cheerio.load(data);

  const cloudflareLink: string = $('#download > ul > li:nth-child(3) > a').attr('href') as string;

  return cloudflareLink;
};

export default scrapeURL;
