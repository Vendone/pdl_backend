const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { findOneById, isAuthenticated } = require("../helperFunctions/index");

//Datenbank verbindung
const db = require("../db");
const pgp = require("pg-promise")({ capSQL: true });

//Exports
module.exports = (app) => {
  app.use("/api/user", router);

  router.get("/get", isAuthenticated, async (req, res, next) => {
    const { id } = req.user;
    const user = await findOneById(id);
    delete user.password;
    res.send(user);
  });

  router.put(
    "/change",
    check("email").isEmail().normalizeEmail(),
    check("firstname").notEmpty().trim().escape().toLowerCase(),
    check("lastname").notEmpty().trim().escape().toLowerCase(),
    check("nickname").notEmpty().trim().escape(),
    isAuthenticated,
    async (req, res, next) => {
      try {
        const params = req.body;
        const id = params.id;

        if (params.firstname == "") {
          delete params.firstname;
        }
        if (params.lastname == "") {
          delete params.lastname;
        }
        if (params.email == "@") {
          delete params.email;
        }
        if (params.nickname == "") {
          delete params.nickname;
        }

        if (
          params.firstname ||
          params.lastname ||
          params.email ||
          params.nickname
        ) {
          // Generate SQL statement - using helper for dynamic parameter injection
          const condition = pgp.as.format("WHERE id = ${id} RETURNING *", {
            id,
          });
          const statement =
            pgp.helpers.update(params, null, "users") + condition;

          // Execute SQL statment
          const result = await db.query(statement);

          res.status(200).send(result.rows[0]);
        } else if (params.nation || params.dart || params.dart_weight) {
          // Generate SQL statement - using helper for dynamic parameter injection
          const condition = pgp.as.format("WHERE userid = ${id} RETURNING *", {
            id,
          });
          const statement =
            pgp.helpers.update(params, null, "user_stats") + condition;

          // Execute SQL statment
          const result = await db.query(statement);

          res.status(200).send(result.rows[0]);
        } else {
          res.status(500);
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  );
};
