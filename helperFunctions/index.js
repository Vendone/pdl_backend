const db = require("../db");
const bcrypt = require("bcrypt");

async function findOneByEmail(email) {
  const statement = `SELECT users.id, users.email, users.password, users.firstname, users.lastname, users.nickname, users.img, 
  users.userlvl, user_stats.dart, user_stats.dart_weight, user_stats.nation, user_stats.ligaid
FROM users LEFT JOIN user_stats ON users.id = user_stats.userid WHERE email = $1 ORDER BY users.id`;
  const values = [email];
  const user = await db.query(statement, values);
  if (!user) {
    return done(null, false, {
      message: "Incorrect username or password.",
    });
  }
  return user.rows[0];
}

async function findOneById(id) {
  const statement = `SELECT users.email, users.password, users.firstname, users.lastname, users.nickname, users.img, 
  users.userlvl, user_stats.dart, user_stats.dart_weight, user_stats.nation, user_stats.ligaid
FROM users LEFT JOIN user_stats ON users.id = user_stats.userid WHERE users.id = $1 ORDER BY users.id`;
  const values = [id];
  const user = await db.query(statement, values);

  if (user.rows?.length) {
    return user.rows[0];
  }
}

async function compareIt(password, userDb) {
  const validPassword = await bcrypt.compare(password, userDb.password);
  const passwordIsCorrect = await validPassword;
  return passwordIsCorrect;
}

module.exports = { findOneByEmail, findOneById, compareIt };
