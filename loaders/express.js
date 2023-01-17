const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
// const pgSession = require("connect-pg-simple")(session);

//connect with PostgresSQL
// const { Pool } = require("pg");
// const connectionString = {
//   connectionString: process.env.DATABASE_URL,
// };

// const pool = new Pool(connectionString);

module.exports = (app) => {
  app.use(bodyParser.json());
  app.use(morgan("dev"));
  app.use(cors());

  app.get("/", (req, res) => {
    res.status(200).send({ msg: "Pro Darts League Backend" });
  });

  return app;
};
