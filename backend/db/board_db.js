// server/db_layer/board_db.js

const pool = require("./db");

/**
 * 모든 게시글 조회 (최신순)
 * 반환: posts[]
 */
async function getAllPosts(userId) {
  const [rows] = await pool.query(
    `SELECT trips.id,trips.title,photos.photo,usertrip.owner FROM 
     trips INNER JOIN usertrip ON trips.id=usertrip.tripId 
     LEFT JOIN photos ON trips.id=photos.tripId
     WHERE usertrip.userId=?
     ORDER BY trips.createdAt DESC`,
    [userId],
  );
  console.log(rows);
  return rows;
}

/**
 * 게시글 생성
 * 반환: insertId
 */
async function createPost(title, content, userId) {
  const [result] = await pool.query(
    "INSERT INTO trips (title, description) VALUES (?, ?)",
    [title, content],
  );
  const insertId = result.insertId;

  await pool.query(
    "INSERT INTO usertrip (owner,userId,tripId) VALUES (?,?,?)",
    [userId, userId, insertId],
  );
  return insertId;
}

/**
 * id로 게시글 1개 조회
 * 반환: post 또는 null
 */
async function getPostById(id) {
  const [rows] = await pool.query("SELECT * FROM trips WHERE id = ?", [id]);
  console.log(rows[0]);
  const [postUserId]=await pool.query("SELECT userId FROM usertrip WHERE tripId=?",[rows[0].id])
  if (!rows || rows.length === 0) return null;
  return {rowId:rows[0],userId:postUserId[0].userId};
}

/**
 * 게시글 삭제
 * 반환: affectedRows
 */
async function deletePostById(id) {
  console.log("deleteId", id);
  await pool.query("DELETE FROM usertrip WHERE tripId = ?", [id]);
  const [result] = await pool.query("DELETE FROM trips WHERE id = ?", [id]);
  return result.affectedRows || 0;
}

module.exports = {
  getAllPosts,
  createPost,
  getPostById,
  deletePostById,
};
