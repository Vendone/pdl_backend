const testRouter = require("./test");
const authRouter = require("./auth");
const userRouter = require("./user");
// const cartRouter = require('./cart');
// const orderRouter = require('./order');
// const productRouter = require('./product');

module.exports = (app, passport) => {
  authRouter(app, passport);
  testRouter(app);
  userRouter(app);
  //   orderRouter(app);
  //   productRouter(app);
};
