// server/db_layer/user_db.js
const pool = require("./db");
const bcrypt = require("bcrypt");
/**
 * username + password로 사용자 조회
 * - 로그인용
 * - 반환: { id, username, createdAt } 또는 null
 */
async function findUserByCredentials(email, password) {
  const [rows] = await pool.query(
    "SELECT id, nickname, createdAt FROM users WHERE email = ? AND password = ?",
    [email, password],
  );
  if (!rows || rows.length === 0) return null;
  return rows[0];
}
async function findUserById(id) {
  const [rows] = await pool.query(
    "SELECT id, nickname, createdAt FROM users WHERE id = ? ",
    [id],
  );
  if (!rows || rows.length === 0) return null;
  return rows[0];
}
async function findUserByEmail(email) {
  const [rows] = await pool.query(
    "SELECT id, nickname,password FROM users WHERE email = ? ",
    [email],
  );
  if (!rows || rows.length === 0) return null;
  return rows[0];
}

async function setStatus(value, userId) {
  console.log("value,userId", value, userId);
  await pool.query("UPDATE users SET status=? WHERE id=?", [!!value, userId]);
}
async function getStatus(userId) {
  const [status] = await pool.query("SELECT status FROM users WHERE id=?", [
    userId,
  ]);
  return status[0];
}
async function getPublicUsers(userId) {
  const [users] = await pool.query(
    "SELECT id,email,nickname FROM users WHERE status=0 AND id!=?",
    [userId],
  );
  return users;
}
async function join(nickname, email, password) {
  // const user = await User.findOne({ where: { email } });
  const [user] = await pool.query("SELECT id FROM users WHERE email=?", [
    email,
  ]);
  console.log(user[0]);
  if (user[0]) {
    return { code: 409, message: "이미 존재하는 이메일 입니다" };
  }
  const hash = await bcrypt.hash(password, 12);
  // console.log(hash);
  // await createUser(nickname, email, hash);
  await pool.query(
    "INSERT INTO users (nickname,email,password) values (?,?,?)",
    [nickname, email, hash],
  );
  return { code: 200, message: "회원가입 성공" };
}
module.exports = {
  findUserByCredentials,
  findUserById,
  findUserByEmail,
  setStatus,
  getStatus,
  getPublicUsers,
  join,
};
