// server/routes/users.js
const express = require("express");
const router = express.Router();
const { group, ungroup, exist } = require("../db/companion_db");
router.post("/group", async (req, res) => {
  const { tripId } = req.body;

  try {
    const exists = await exist(req.user.id, tripId);
    console.log("exists", exists);
    if (!exists.count) {
      const result = await group(req.user.id, tripId);
      console.log("result", result);
      return res.status(200).json({ message: "ok", data: result });
    } else {
      throw new Error("이미 group 입니다.");
    }
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "err", data: e.message });
  }
});
router.get("/ungroup/:id", async (req, res) => {
  const tripId = Number(req.params.id);
  console.log(tripId);
  try {
    const result = await ungroup(req.user.id, tripId);
    console.log(result);
    return res.status(200).json({ message: "ok", data: result.data });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ message: "err", data: e.message });
  }
});
module.exports = router;
