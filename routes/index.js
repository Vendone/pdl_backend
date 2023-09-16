const authRouter = require("./auth");
const userRouter = require("./user");
const playerRouter = require("./player");
const leagueRouter = require("./league");
const gameplanRouter = require("./gameplan");
// const productRouter = require('./product');

module.exports = (app, passport) => {
  authRouter(app, passport);
  userRouter(app, passport);
  playerRouter(app);
  leagueRouter(app);
  gameplanRouter(app);
  //   productRouter(app);
};
