const testRouter = require("./test");
// const cartRouter = require('./cart');
// const orderRouter = require('./order');
// const productRouter = require('./product');
// const userRouter = require('./user');

module.exports = (app, passport) => {
  //   authRouter(app, passport);
  testRouter(app);
  //   orderRouter(app);
  //   productRouter(app);
  //   userRouter(app);
};
