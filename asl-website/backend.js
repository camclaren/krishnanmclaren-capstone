const express = require("express");
const multer = require("multer");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
//const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/Users/madhangikrishnan/Documents/GitHub/krishnanmclaren-capstone/asl-website/recorded-videos"); // directory for save files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const originalName = file.originalname; // file name
    const extension = originalName.substring(originalName.lastIndexOf(".")); // get file format
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`); // file name
  },
});
const app = express();
const upload = multer({ storage: storage });

// end point of processing video 
app.post("/process-video", upload.single("video"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No video uploaded." });
  }

  console.log("File uploaded successfully:", req.file);
  const videoPath = req.file.path; // save in temp dir


  // create JSON file path (save in the same dir) 
  const path = require("path"); // path module
  const jsonPath = path.join(
  path.dirname(videoPath), // video file dir
  `${path.basename(videoPath, path.extname(videoPath))}.json`
);



  // Run Python Script
  let pythonProcess;
  if (req.body.scriptName === "Submit") {
      pythonProcess = spawn("python3", [
        "/Users/madhangikrishnan/Documents/GitHub/krishnanmclaren-capstone/model/ST-GCN/model.py",
        "--video",
        videoPath,
      ]);

  }



  // handle python process exit
  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      return res
        .status(500)
        .json({ error: "Python script failed to process the video." });
    }

    console.log(`Attempting to read JSON file at: ${jsonPath}`);
    // read JSON result
    fs.readFile(jsonPath, "utf8", (err, data) => {
      if (err) {
        console.error("Error Reading JSON File:", err);
        return res
          .status(500)
          .json({ error: "Failed to read the output JSON file." });

      }else{
        console.log("JSON File Data:", data);
      }
      res.json(JSON.parse(data)); // return results
    });

  });
});

  // to check the root url
app.get("/", (req, res) => {
  res.send("Server is running and ready to receive requests!");
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});