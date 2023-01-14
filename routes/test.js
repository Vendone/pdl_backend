const express = require("express");
const router = express.Router();

// const OrderService = require("../services/OrderService");
// const OrderServiceInstance = new OrderService();

//Datenbank verbindung
const db = require("../db");
const pgp = require("pg-promise")({ capSQL: true });

//Exports
module.exports = (app) => {
  app.use("/api/test", router);

  router.get("/", async (req, res, next) => {
    res.status(200).send({ msg: "Test" });
  });

  router.get("/data", async (req, res, next) => {
    const statement = `SELECT * FROM test`;
    try {
      const result = await db.query(statement);

      if (result.rows?.length) {
        console.log(result.rows);
      }
      res.status(200).send(result.rows);
    } catch (err) {
      console.log(err);
    }
  });

  router.post("/data", async (req, res, next) => {
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
