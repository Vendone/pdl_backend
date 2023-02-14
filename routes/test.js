const express = require("express");
const router = express.Router();

//Datenbank verbindung
const db = require("../db");

//Exports
module.exports = (app) => {
  app.use("/api/test", router);

  router.get("/", async (req, res, next) => {
    res.status(200).send({ msg: "Test" });
  });

  router.get("/get", async (req, res, next) => {
    const statement = `SELECT * FROM users`;
    try {
      const result = await db.query(statement);
      res.status(200).send(result.rows);
    } catch (err) {
      console.log(err);
    }
  });

  router.post("/post", async (req, res, next) => {
    const statement = "INSERT INTO test(test) VALUES($1)";
    const values = ["info"];
    try {
      const result = await db.query(statement, values);
      res.status(201).send();
    } catch (err) {
      console.log(err);
    }
  });
};
