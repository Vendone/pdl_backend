const db = require("../db");
const bcrypt = require("bcrypt");

async function findOneByEmail(email) {
  const statement = `SELECT *
FROM users
WHERE email = $1`;
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
  const statement = `SELECT *
  FROM users
  WHERE id = $1`;
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
