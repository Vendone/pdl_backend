const express = require("express");
const router = express.Router();

//Datenbank verbindung
const db = require("../db");
const pgp = require("pg-promise")({ capSQL: true });

module.exports = (app) => {
  app.use("/api/player", router);

  router.get("/", async (req, res, next) => {
    const player = { name: "test", liga: 1 };
    res.send(player);
  });
};
