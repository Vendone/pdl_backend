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
    player1, player2, season_id, league_id, start, ende, title
    FROM gameplan`;
    const gameplan = await db.query(statement);
    if (!gameplan) {
      return done(null, false, {
        message: "no Gameplan",
      });
    }

    res.send(gameplan.rows);
  });

  router.post("/", async (req, res, next) => {
    try {
      await db.query(pgp.helpers.insert(req.body, null, "gameplan"));
      res.status(201).send();
    } catch (err) {
      next(err);
    }
  });
};
