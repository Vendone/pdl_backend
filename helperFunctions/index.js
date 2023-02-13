const db = require("../db");

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
module.exports = { findOneByEmail };
