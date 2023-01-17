const expressLoader = require("./express");
const routeLoader = require("../routes");

module.exports = async (app) => {
  // Load Express middlewares
  const expressApp = await expressLoader(app);

  // Load API route handlers
  await routeLoader(app);

  // Error Handler
  app.use((err, req, res, next) => {
    const { message, status } = err;

    return res.status(500).send({ message });
  });
};
