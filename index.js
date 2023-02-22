require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const loaders = require("./loaders");

async function startServer() {
  // Init application loaders
  loaders(app);

  // Start server
  app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`);
  });
}

startServer();
