const controllers = {};

// controllers.getTitle = require("./getTitles_promises");
controllers.getTitle = require("./getTitles_async-await");

module.exports = controllers;
