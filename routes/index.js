const express = require("express");
const router = express.Router();
const { getTitle } = require("../controllers");
const { userValidationRules, validate }  = require("../middlewares/validator");

router.get("/", userValidationRules(), validate, getTitle.titleExt);

module.exports = router;
