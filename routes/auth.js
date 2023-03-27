const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { check } = require("express-validator");
const db = require("../db");
const pgp = require("pg-promise")({ capSQL: true });
const {
  findOneByEmail,
  findOneById,
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../helperFunctions/index");

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
    checkNotAuthenticated,
    async (req, res, next) => {
      try {
        const data = req.body;
        const checkUser = await findOneByEmail(data.email);
        if (checkUser) {
          res.status(403).send("user alredy exists");
        }
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
    check("email").isEmail().normalizeEmail(),
    check("password").notEmpty(),
    passport.authenticate("local"),
    async (req, res, next) => {
      try {
        const result = req.user;
        delete result.password;
        res.status(200).send(result);
      } catch (err) {
        next(err);
      }
    }
  );

  // Check Login Status Endpoint
  router.get("/checkauth", checkAuthenticated, async (req, res, next) => {
    try {
      const user = await findOneById(req.user.id);
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
