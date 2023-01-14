const express = require("express");
const router = express.Router();

// const OrderService = require("../services/OrderService");
// const OrderServiceInstance = new OrderService();

module.exports = (app) => {
  app.use("/api/test", router);

  router.get("/", async (req, res, next) => {
    res.status(200).send({ msg: "Test" });
  });

  router.get("/data", async (req, res, next) => {
    res.status(200).send({ msg: "Datenbank abfrage" });
  });
};
