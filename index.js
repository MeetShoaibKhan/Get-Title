const express = require("express");
const https = require("https");
const urlExists = require("url-exists");
const main = require("./routes");

const app = express();

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.use("/I/want/title/", main);

//The 404 Route (ALWAYS Keep this as the last route)
app.get("*", function (req, res) {
  res.status(404).send("Page Not found");
});

app.listen(12345, () => {
  console.log("Server running on port 12345");
});
