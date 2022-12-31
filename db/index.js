"use strict";

const { Pool } = require("pg");
// const { DB } = require("../config");
// const isProduction = process.env.NODE_ENV === "production";
const connectionString = {
  connectionString: process.env.DATABASE_URL,
};

const pool = new Pool(connectionString);

module.exports = {
  query: (text, params) => pool.query(text, params),
};
