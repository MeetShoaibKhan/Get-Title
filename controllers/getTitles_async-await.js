const fetch = require("node-fetch");
const urlExist = require("url-exist");

module.exports = {
  titleExt: async (req, res) => {

      let { address } = req.query;

      if (typeof address === "string") {
        // it's a single url
          address = [address];        
      } 


        let titles = [];
        let promises = [];
        //"it's a list of urls"
        for (url of address) {
          let tmpPromise = await getTitle(url);
          promises.push(tmpPromise);
        }

        let resolved = await Promise.all(promises); // All the urls are scraped in parallel
        let indivResult = resolved.forEach((a) => (titles = titles.concat(a)));
        return res.render("../index.html", {
          titles: titles,
          urls: address,
        });
      
  },
};

const getTitle = async (url) => {
  let title = "";

//Add https 
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
    url = "https://" + url;
  }
//Add www.
  if (url.slice(8, 11) != "www") {
    url = url.slice(0, 8) + "www." + url.slice(8);
  }


  const urlEx = await checkUrl(url);
  if (urlEx) {
    const html = await getHtml(url);
    title = scrapeHtml(html);
  } else {
    title = `NO RESPONSE`;
  }
  return title;
};

const checkUrl = async (url) => {
  const exists = await urlExist(url);
  return exists;
};

const getHtml = async (url) => {
  const response = await fetch(url);
  const body = await response.text();
  return body;
};

const scrapeHtml = (html) => {
  let text = html;
  let start = text.search("<title>") + 7;
  let end = text.search("</title>");
  let title = [];

  while (start < end) {
    title.push(html[start]);
    start = start + 1;
  }
  title = title.join("");

  return title;
};
