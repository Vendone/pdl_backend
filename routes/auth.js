const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { check } = require("express-validator");
const db = require("../db");
const pgp = require("pg-promise")({ capSQL: true });
const { findOneByEmail } = require("../helperFunctions/index");
const { findOneById } = require("../helperFunctions/index");

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
      try {
        const { username, password } = req.body;

        //user finden
        const user = await findOneByEmail(username);
        // If no user found, reject
        if (!user) {
          res.status(401).send("no user found");
        }

        //Passwort überprüfen
        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
          res.status(401).send("password is incorrect");
        }
        delete user.password;
        delete user.id;
        res.status(200).send(user);
      } catch (err) {
        next(err);
      }
    }
  );

  // Check Login Status Endpoint
  router.get("/logged_in", async (req, res, next) => {
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
