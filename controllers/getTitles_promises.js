const urlExists = require("url-exists");
const https = require("https");

module.exports = {
  titleExt: async (req, res) => {

      let results = [];
      let names = [];
      let promises = [];

      let { address } = req.query;

      if (typeof address === "string") {
        // it's a single url
          address = [address];        
      } 


        for (url of address) {
          let tmpPromise = await check("GET", url);
          promises.push(tmpPromise);
        }

        let resolved = await Promise.all(promises); // All the urls are scraped in parallel
        let indivResult = resolved.forEach(
          (a) => (results = results.concat(a))
        );
        return res.render("../index.html", {
          titles: results,
          urls: address,
        });
      

  },
};

const check = (method, url) =>
  new Promise((resolve, reject) => {

    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
      url = "https://" + url;
    }

    if (url.slice(8, 11) != "www") {
      url = url.slice(0, 8) + "www." + url.slice(8);
    }
    console.log(url);
    urlExists(url, function (err, exists) {
      if (exists) {
        scrapeHtml(url).then((data) => {
          resolve(data);
        });
      } else {
        resolve(`NO RESPONSE`);
      }
    });
  });

// custom fetch method
const fetch = (method, url, payload = undefined) =>
  new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        const dataBuffers = [];
        res.on("data", (data) => dataBuffers.push(data.toString("utf8")));
        res.on("end", () => resolve(dataBuffers.join("")));
      })
      .on("error", reject);
  });

const scrapeHtml = (url) =>
  new Promise((resolve, reject) => {
    fetch("GET", url).then((html) => {
      let text = html;
      let start = text.search("<title>") + 7;
      let end = text.search("</title>");
      let name = [];

      while (start < end) {
        name.push(html[start]);
        start = start + 1;
      }
      name = name.join("");

      resolve(name);
    });
  });
