const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const {
  findOneByEmail,
  compareIt,
  findOneById,
} = require("../helperFunctions/index");

module.exports = (app) => {
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: true,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        secure: false,
      },
      store: new (require("connect-pg-simple")(session))(),
      createTableIfMissing: true,
    })
  );
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

  passport.deserializeUser(async (id, done) => {
    const user = await findOneById(id);
    if (!user) {
      done(error);
    }
    done(null, user);
  });

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  return passport;
};
