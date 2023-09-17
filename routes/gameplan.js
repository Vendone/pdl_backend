const express = require("express");
const router = express.Router();

//Datenbank verbindung
const db = require("../db");
const pgp = require("pg-promise")({ capSQL: true });

module.exports = (app) => {
  app.use("/api/gameplan", router);

  router.get("/", async (req, res, next) => {
    const statement = `
    SELECT 
    player1, player2, season_id, league_id, start, "end", title
    FROM gameplan`;
    const gameplan = await db.query(statement);
    if (!gameplan) {
      return done(null, false, {
        message: "no Gameplan",
      });
    }

    res.send(gameplan.rows);
  });
};
