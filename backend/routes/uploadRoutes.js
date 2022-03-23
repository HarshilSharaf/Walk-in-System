const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { promisify } = require("util");
const path = require("path");
const { Readable } = require('stream');
const pipeline = promisify(require("stream").pipeline);

const router = express.Router();

const upload = multer();
function bufferToStream(binary) {

  const readableInstanceStream = new Readable({
    read() {
      this.push(binary);
      this.push(null);
    }
  });

  return readableInstanceStream;
}
router.post("/resume", upload.single("file"), (req, res) => {
  const { file } = req;
  console.log("FILENAME:",file)

  if (path.extname(file.originalname) != ".pdf") {
    res.status(400).json({
      message: "Invalid format",
    });
  } else {
    const filename = `${uuidv4()}${path.extname(file.originalname)}`;

    pipeline(
      bufferToStream(file.buffer),
      fs.createWriteStream(`${__dirname}/../public/resume/${filename}`)
    )
      .then(() => {
        res.send({
          message: "File uploaded successfully",
          url: `/host/resume/${filename}`,
        });
      })
      .catch((err) => {
        console.log("Error while uploading:",err)
        res.status(400).json({
          message: "Error while uploading",
        });
      });
  }
});

router.post("/profile", upload.single("file"), (req, res) => {
  const { file } = req;
  if (
    path.extname(file.originalname) != ".jpg" &&
    path.extname(file.originalname) != ".png"
  ) {
    res.status(400).json({
      message: "Invalid format",
    });
  } else {
    const filename = `${uuidv4()}${path.extname(file.originalname)}`;

    pipeline(
     bufferToStream(file.buffer),
      fs.createWriteStream(`${__dirname}/../public/profile/${filename}`)
    )
      .then(() => {
        res.send({
          message: "Profile image uploaded successfully",
          url: `/host/profile/${filename}`,
        });
      })
      .catch((err) => {
        res.status(400).json({
          message: "Error while uploading",
        });
      });
  }
});

module.exports = router;
