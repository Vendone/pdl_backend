const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

module.exports = (app) => {
  app.use(bodyParser.json());
  app.use(morgan("dev"));
  app.use(cors());

  app.get("/", (req, res) => {
    res.status(200).send({ msg: "Pro Darts League Backend" });
  });
};
