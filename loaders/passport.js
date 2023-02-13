const passport = require("passport");
const LocalStrategy = require("passport-local");
const db = require("../db");
const bcrypt = require("bcrypt");
const { findOneByEmail } = require("../helperFunctions/index");

module.exports = (app) => {
  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Set method to serialize data to store in cookie
  passport.serializeUser((user, done) => {
    // done(null, user.id);
    done(null, { id: user.id, username: user.email });
  });

  // Set method to deserialize data stored in cookie and attach to req.user
  passport.deserializeUser((id, done) => {
    done(null, { id });
  });

  // Configure strategy to be use for local login
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      //find user in database

      const user = await findOneByEmail(username);

      // Passwort prüfen
      async function compareIt(password, userDb) {
        const validPassword = await bcrypt.compare(password, userDb.password);
        const passwordIsCorrect = await validPassword;
        return passwordIsCorrect;
      }

      try {
        const checkPassword = await compareIt(password, user);

        if (!checkPassword) {
          return done(null, false, {
            message: "Incorrect username or password.",
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  return passport;
};
