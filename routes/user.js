const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

//Datenbank verbindung
const db = require("../db");
const pgp = require("pg-promise")({ capSQL: true });

//Exports
module.exports = (app) => {
  app.use("/api/user", router);

  router.put(
    "/change",
    check("email").isEmail().normalizeEmail(),
    check("firstname").notEmpty().trim().escape().toLowerCase(),
    check("lastname").notEmpty().trim().escape().toLowerCase(),
    check("nickname").notEmpty().trim().escape(),
    async (req, res, next) => {
      try {
        const data = req.body;
        const id = data.id;
        const params = req.body;

        if (data.firstname == "") {
          delete data.firstname;
        }
        if (data.lastname == "") {
          delete data.lastname;
        }
        if (data.email == "@") {
          delete data.email;
        }
        if (data.nickname == "") {
          delete data.nickname;
        }

        console.log(data);
        // Generate SQL statement - using helper for dynamic parameter injection
        const condition = pgp.as.format("WHERE id = ${id} RETURNING *", {
          id,
        });
        const statement = pgp.helpers.update(params, null, "users") + condition;

        // Execute SQL statment
        const result = await db.query(statement);

        res.status(200).send(result.rows[0]);
      } catch (err) {
        throw new Error(err);
      }
    }
  );
};
