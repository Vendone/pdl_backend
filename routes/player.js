const express = require("express");
const router = express.Router();

//Datenbank verbindung
const db = require("../db");
const pgp = require("pg-promise")({ capSQL: true });

module.exports = (app) => {
  app.use("/api/player", router);

  router.get("/", async (req, res, next) => {
    const statement = `
    SELECT 
    users.firstname, users.lastname, users.nickname, users.img,
    stats.games, stats.win, stats.lose, stats.tie, stats.points, stats.differenz, stats.dart, stats.dart_weight, stats.nation, stats.ligaid
    FROM users 
    LEFT JOIN user_stats AS stats ON users.id = stats.userid`;
    const player = await db.query(statement);
    if (!player) {
      return done(null, false, {
        message: "no Player",
      });
    }

    res.send(player.rows);
  });
};
