const express = require("express");
const app = express();

const loaders = require("./loaders");
const port = process.env.PORT;

async function startServer() {
  // Init application loaders
  loaders(app);

  // Start server
  app.listen(port, () => {
    console.log(`Server listening on PORT ${port}`);
  });
}
startServer();
