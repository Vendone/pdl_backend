const authRouter = require("./auth");
const userRouter = require("./user");
const playerRouter = require("./player");
// const orderRouter = require('./order');
// const productRouter = require('./product');

module.exports = (app, passport) => {
  authRouter(app, passport);
  userRouter(app, passport);
  playerRouter(app);
  //   productRouter(app);
};
