const express = require("express");
const router = express.Router();

//Datenbank verbindung
const db = require("../db");
const pgp = require("pg-promise")({ capSQL: true });

module.exports = (app) => {
  app.use("/api/league", router);

  router.get("/", async (req, res, next) => {
    const statement = `
    SELECT 
    id, name, info
    FROM league`;
    const league = await db.query(statement);
    if (!league) {
      return done(null, false, {
        message: "no League",
      });
    }

    res.send(league.rows);
  });
};
