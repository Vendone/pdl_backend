const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const pg = require("pg");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const pgSession = require("connect-pg-simple")(session);
const connectionString = {
  connectionString: process.env.DATABASE_URL,
};

const pgPool = new pg.Pool({
  connectionString,
});

module.exports = (app) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser(process.env.SESSION_SECRET));
  app.use(morgan("dev"));
  app.use(
    cors({
      origin: process.env.REACT_URL,
      credentials: true,
    })
  );

  // Creates a session
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

  app.get("/", (req, res) => {
    res.status(200).send({ msg: "Pro Darts League Backend" });
  });

  return app;
};
