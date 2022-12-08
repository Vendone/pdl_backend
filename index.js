const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send({ msg: "Pro Darts League Backend" });
});

app.listen(port, () => {
  console.log(`Server listening on PORT ${port}`);
});
