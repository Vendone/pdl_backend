const express = require("express");
const router = express.Router();

//Datenbank verbindung
const db = require("../db");
const pgp = require("pg-promise")({ capSQL: true });

module.exports = (app) => {
  app.use("/api/player", router);

  router.get("/", async (req, res, next) => {
    const statement = `SELECT firstname, lastname, nickname FROM users`;
    const player = await db.query(statement);
    if (!player) {
      return done(null, false, {
        message: "no Player",
      });
    }

    res.send(player.rows);
  });
};
