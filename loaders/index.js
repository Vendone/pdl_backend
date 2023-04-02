require("dotenv").config();
const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const pg = require("pg");
const session = require("express-session");
const routeLoader = require("../routes/index");
const cookieParser = require("cookie-parser");
const LocalStrategy = require("passport-local").Strategy;
const connectionString = {
  connectionString: process.env.DATABASE_URL,
};
const sessionPool = require("pg").Pool;

const sessionDBaccess = new sessionPool({
  user: "postgres",
  password: "swud7zsd",
  host: "localhost",
  port: 5432,
  database: "pdl",
});

const pgPool = new pg.Pool({
  connectionString,
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

module.exports = async (app) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: false }));
  app.use(morgan("dev"));
  app.use(
    cors({
      origin: process.env.REACT_URL,
      methods: ["POST", "PUT", "GET", "OPTIONS", "DELETE"],
      credentials: true,
    })
  );

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

  app.get("/", (req, res) => {
    res.status(200).send({ msg: "Pro Darts League Backend" });
  });
  // Load API route handlers
  await routeLoader(app);

  // Error Handler
  app.use((err, req, res, next) => {
    const { message, status } = err;

    return res.status(500).send({ message });
  });
};
