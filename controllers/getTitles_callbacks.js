const fetch = require("node-fetch");
const urlExist = require("url-exist");

module.exports = {
  titleExt: async (req, res) => {
    if (req.query.address) {
      const url = req.query.address;

      if (typeof url === "string") {
        // it's a single url
        let title = await getTitle(url);

        return res.render("../index.html", {
          titles: [title],
          urls: [url],
        });
      } else {
        let titles = [];
        let promises = [];
        //"it's a list of urls"
        for (ur of url) {
          let tmpPromise = await getTitle(ur);
          promises.push(tmpPromise);
        }

        let resolved = await Promise.all(promises); // All the urls are scraped in parallel
        let indivResult = resolved.forEach((a) => (titles = titles.concat(a)));
        return res.render("../index.html", {
          titles: titles,
          urls: url,
        });
      }
    } else {
      res.status(400).send("no url found");
    }
  },
};

const getTitle = async (url) => {
  let title = "";
  const urlEx = await checkHtml(url);
  if (urlEx) {
    const html = await getHtml(url);
    title = scrapeHtml(html);
  } else {
    title = `NO RESPONSE`;
  }
  return title;
};

const checkHtml = async (url) => {
  if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
    url = "https://" + url;
  }

  if (url.slice(8, 11) != "www") {
    url = url.slice(0, 8) + "www" + url.slice(8);
  }

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
