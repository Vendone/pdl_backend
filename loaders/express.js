const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const pg = require("pg");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const connectionString = {
  connectionString: process.env.DATABASE_URL,
};

const pgPool = new pg.Pool({
  connectionString,
});

module.exports = (app) => {
  app.use(bodyParser.json());
  app.use(morgan("dev"));
  app.use(cors());

  // Creates a session
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
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
