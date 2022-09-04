const controllers = {};

// controllers.getTitle = require("./getTitles_promises");
controllers.getTitle = require("./getTitles_async-await");
controllers.getTitle = require("./getTitles_callbacks");

module.exports = controllers;
