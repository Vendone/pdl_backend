require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const pg = require("pg");
const cookieParser = require("cookie-parser");
const connectionString = {
  connectionString: process.env.DATABASE_URL,
};

const pgPool = new pg.Pool({
  connectionString,
});

module.exports = (app) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: false }));
  app.use(morgan("dev"));
  app.use(
    cors({
      origin: process.env.REACT_URL,
      methods: ["POST", "PUT", "GET", "OPTIONS", "DELETE"],
      credentials: true,
    })
  );

  app.get("/", (req, res) => {
    res.status(200).send({ msg: "Pro Darts League Backend" });
  });

  return app;
};
