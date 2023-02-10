const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { check } = require("express-validator");
const db = require("../db");
const pgp = require("pg-promise")({ capSQL: true });

module.exports = (app, passport) => {
  app.use("/api/auth", router);

  router.post(
    "/register",
    check("email").isEmail().normalizeEmail(),
    check("firstname").notEmpty().trim().escape().toLowerCase(),
    check("lastname").notEmpty().trim().escape().toLowerCase(),
    check("nickname").notEmpty().trim().escape(),
    check("password").notEmpty(),
    check("confirmpassword").notEmpty(),
    async (req, res, next) => {
      try {
        const data = req.body;
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const cleanData = {
          firstname: data.firstname,
          lastname: data.lastname,
          nickname: data.nickname,
          email: data.email,
          password: hashedPassword,
        };

        // Generate SQL statement - using helper for dynamic parameter injection
        const statement =
          pgp.helpers.insert(cleanData, null, "users") + "RETURNING *";

        // Execute SQL statment
        const result = await db.query(statement);

        res.status(201).send();
      } catch (err) {
        next(err);
      }
    }
  );

  router.post(
    "/login",
    check("username").isEmail().normalizeEmail(),
    check("password").notEmpty(),
    passport.authenticate("local"),
    async (req, res, next) => {
      async function findOneByEmail(email) {
        const statement = `SELECT *
        FROM users
        WHERE email = $1`;
        const values = [email];
        const user = await db.query(statement, values);

        if (!user) {
          return done(null, false, {
            message: "Incorrect username or password.",
          });
        }
        return user.rows[0];
      }

      try {
        const { username, password } = req.body;

        //user finden
        const response = await findOneByEmail(username);
        delete response.password;
        res.status(200).send(response);
      } catch (err) {
        next(err);
      }
    }
  );

  // Check Login Status Endpoint
  router.get("/logged_in", async (req, res, next) => {
    async function findOneById(id) {
      const statement = `SELECT *
    FROM users
    WHERE id = $1`;
      const values = [id];
      const user = await db.query(statement, values);

      if (user.rows?.length) {
        return user.rows[0];
      }
    }
    try {
      const { id } = req.user;
      const user = await findOneById(id.id);
      delete user.password;
      res.status(200).send({
        loggedIn: true,
        user,
      });
    } catch (err) {
      next(err);
    }
  });

  router.delete("/logout", async (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.status(200).send({});
    });
  });
};
