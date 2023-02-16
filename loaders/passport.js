const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const pg = require("pg");
const { findOneByEmail, compareIt } = require("../helperFunctions/index");

//connect with PostgresSQL
const connectionString = {
  connectionString: process.env.DATABASE_URL,
};

const pgPool = new pg.Pool(connectionString);

module.exports = (app) => {
  // Creates a session
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: true,
      cookie: {
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      },
      store: new pgSession({
        pool: pgPool, // Connection pool
        tableName: "user_sessions", // Use another table-name than the default "session" one
        // Insert connect-pg-simple options here
      }),
    })
  );
  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Set method to serialize data to store in cookie
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // Set method to deserialize data stored in cookie and attach to req.user
  passport.deserializeUser(function (id, done) {
    done(null, { id });
  });

  // Configure strategy to be use for local login
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        //find user in database
        const user = await findOneByEmail(username);
        if (!user) {
          return done(null, false);
        }
        // Passwort prüfen
        const checkPassword = await compareIt(password, user);
        if (!checkPassword) {
          return done(null, false);
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  return passport;
};
