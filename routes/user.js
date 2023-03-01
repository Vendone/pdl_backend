const express = require("express");
const router = express.Router();

//Datenbank verbindung
const db = require("../db");

//Exports
module.exports = (app) => {
  app.use("/api/user", router);
};
