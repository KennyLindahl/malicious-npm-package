const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/", (req, res) => {
  try {
    const captureDecoded = Buffer.from(req.body.data, "base64").toString(
      "utf8"
    );
    console.log("\n----------------------------");
    console.log(req.body.url);
    console.log(captureDecoded);
  } catch (e) {
    console.error(e);
  }
  res.send("ok");
});

app.listen(7000, function () {
  console.log("Example app listening on port " + 7000 + "!");
});

///////////// Receive image and save ///////////////

// Configure multer to use diskStorage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // sets the destination of where the file should be saved
  },
  filename: (req, file, cb) => {
    const dir = "./uploads";
    let filenameBase = "image";
    let filename = `${filenameBase}${path.extname(file.originalname)}`;
    let counter = 1;

    // Check if file exists, if it does, increment counter and append to filename
    while (fs.existsSync(`${dir}/${filename}`)) {
      filename = `${filenameBase}_${counter}${path.extname(file.originalname)}`;
      counter++;
    }

    cb(null, filename); // sets the filename
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    res.status(400).send("No files were uploaded.");
    return;
  }

  res.send(`File ${req.file.filename} uploaded successfully!`);
});
