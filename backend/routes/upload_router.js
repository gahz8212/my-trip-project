const express = require("express");
const upload = require("../middlewares/multer_config.js");
const router = express.Router();
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const albumService = require("../db/upload_db.js");

router.post("/", upload.single("image"), async (req, res) => {
  const { tripId } = req.body;
  console.log("tripId", tripId);

  console.log("파일 수신 완료:", req.file.filename);
  try {
    // 1. 로그인 여부 확인 (Passport가 제공하는 함수)
    if (!req.isAuthenticated())
      return res.status(401).json({ error: "로그인이 필요합니다." });
    // 2. 파일 유효성 검사
    if (!req.file) {
      return res.status(400).json({ error: "파일 없음" });
    }
    // 원본 파일 경로
    const inputPath = req.file.path;
    const outputPath = path.join(
      "uploads",
      Date.now() + "-" + req.file.originalname,
    );
    // sharp으로 리사이즈 및 압축
    await sharp(inputPath)
      .resize({ width: 1024 }) // 가로 1024px, 세로는 비율 유지
      .jpeg({ quality: 80 }) // JPEG 품질 70%
      .toFile(outputPath);
    // 원본 삭제 → 압축본만 남김
    fs.unlinkSync(inputPath);
    // req.file 정보를 압축본으로 교체
    req.file.path = outputPath;
    req.file.filename = path.basename(outputPath);
    const result = await albumService.uploadProcess(
      req.user.id,
      tripId,
      req.file.filename,
    );

    res.json({ message: "서버 저장 성공!", fileName: req.file.filename });
  } catch (e) {
    console.error(e);
    res.status(401).json({ message: e });
  }
});
module.exports = router;
