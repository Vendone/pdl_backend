const expressLoader = require("./express");

module.exports = async (app) => {
  // Load Express middlewares
  const expressApp = await expressLoader(app);

  // Error Handler
  app.use((err, req, res, next) => {
    const { message, status } = err;

    return res.status(500).send({ message });
  });
};
