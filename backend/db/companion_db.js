const pool = require("./db");
const group = async (userId, tripId) => {
  const [res] = await pool.query(
    `INSERT INTO usertrip(userId,tripId) VALUES (?,?)`,
    [userId, tripId],
  );
  console.log(res.affectedRows);
  return res.affectedRows;
};
const ungroup = async (userId, tripId) => {
  const [res] = await pool.query(
    `DELETE from usertrip WHERE userId=? and tripId=?`,
    [userId, tripId],
  );
  console.log("res", res);
  return res.affectedRows;
};
const exist = async (userId, tripId) => {
  const [count] = await pool.query(
    `SELECT count(*) as count from usertrip WHERE userId=? and tripId=?`,
    [userId, tripId],
  );
  return count[0];
};
module.exports = {
  group,
  ungroup,
  exist,
};
