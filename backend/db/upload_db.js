// server/db_layer/user_db.js
const pool = require("./db");
/**
 * username + password로 사용자 조회
 * - 로그인용
 * - 반환: { id, username, createdAt } 또는 null
 */
async function uploadProcess(userId, tripId, photo) {
  const [rows] = await pool.query(
    "insert into photos (photo,userId,tripId) values (?,?,?)",
    [photo, userId, tripId],
  );
  if (!rows || rows.length === 0) return null;
  return rows[0];
}

module.exports = {
  uploadProcess,
};
