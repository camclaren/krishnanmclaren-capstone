const express = require("express");
const multer = require("multer");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors()); // Allow requests from frontend

app.get('/auth', (req, res) => {
  res.json({ success: true, message: 'Auth route works!' });
});

app.get('/videohandler', (req, res) => {
  res.json({ success: true, message: 'Video handler works!' });
});

app.get('/videohandler', (req, res) => {
  const filePath = path.join(__dirname, 'asl-website', 'recorded_video.mp4'); // or .webm etc

  if (fs.existsSync(filePath)) {
      res.json({ success: true, message: 'Video file found.' });
  } else {
      res.status(404).json({ success: false, message: 'No video file yet.' });
  }
});

// File storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/Users/madhangikrishnan/Documents/GitHub/krishnanmclaren-capstone/asl-website/recorded-videos");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  },
});

const upload = multer({ storage: storage });

// endpoint matching frontend: http://localhost:8000/process-video
app.post("/process-video", upload.single("video"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No video uploaded." });
  }

  console.log("File uploaded successfully:", req.file.path);
  const videoPath = req.file.path;

  const jsonPath = path.join(
    path.dirname(videoPath),
    `${path.basename(videoPath, path.extname(videoPath))}.json`
  );

  const pythonProcess = spawn("python3", [
    "/Users/madhangikrishnan/Documents/GitHub/krishnanmclaren-capstone/model/ST-GCN/model.py",
    "--video",
    videoPath,
  ]);

  pythonProcess.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: "Python script failed to process the video." });
    }

    console.log(`Reading JSON result from: ${jsonPath}`);
    fs.readFile(jsonPath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading JSON file:", err);
        return res.status(500).json({ error: "Failed to read output JSON file." });
      }

      try {
        const parsedData = JSON.parse(data);
        console.log("Parsed JSON:", parsedData);
        res.json(parsedData);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        res.status(500).json({ error: "Error parsing JSON result." });
      }
    });
  });
});

// Test root
app.get("/", (req, res) => {
  res.send("Server is running and ready to receive requests!");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
