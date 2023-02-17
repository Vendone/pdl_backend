const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const {
  findOneByEmail,
  compareIt,
  findOneById,
} = require("../helperFunctions/index");

module.exports = (app) => {
  // Configure strategy to be use for local login
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await findOneByEmail(email);
          if (!user) {
            return done(null, false);
          }
          const passwordIsCorrect = await compareIt(password, user);
          if (!passwordIsCorrect) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((user, done) => {
    done(null, findOneById(user.id));
  });

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  return passport;
};
