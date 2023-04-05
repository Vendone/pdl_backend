const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const pg = require("pg");
const sessionPool = require("pg").Pool;

const sessionDBaccess = new sessionPool({
  user: "postgres",
  password: "swud7zsd",
  host: "localhost",
  port: 5432,
  database: "pdl",
});

const {
  findOneByEmail,
  compareIt,
  findOneById,
} = require("../helperFunctions/index");
const pgSession = require("connect-pg-simple")(session);

const sessionConfig = {
  store: new pgSession({
    pool: sessionDBaccess,
    tableName: "session",
  }),
  name: "sid",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    aameSite: true,
    secure: false, // ENABLE ONLY ON HTTPS
  },
};

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

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id, done) => {
    return done(null, findOneById(id));
  });

  app.use(session(sessionConfig));

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  return passport;
};
