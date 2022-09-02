const express = require("express");
const router = express.Router();
const { getTitle } = require("../controllers");

router.get("/", getTitle.titleExt);

module.exports = router;
