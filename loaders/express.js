const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const pg = require("pg");

//connect with PostgresSQL
const connectionString = {
  connectionString: process.env.DATABASE_URL,
};

const pgPool = new pg.Pool(connectionString);

module.exports = (app) => {
  app.use(bodyParser.json());
  app.use(morgan("dev"));
  app.use(cors());

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
      // store: new pgSession({
      //   pool: pgPool, // Connection pool
      //   tableName: "user_sessions", // Use another table-name than the default "session" one
      //   // Insert connect-pg-simple options here
      // }),
    })
  );

  app.get("/", (req, res) => {
    res.status(200).send({ msg: "Pro Darts League Backend" });
  });

  return app;
};
