const express = require("express");
const multer = require("multer");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
//const path = require("path");

const app = express();




  // Run Python Script 
  let pythonProcess;
  if (req.body.scriptName === "stopBtn") {
    /*    pythonProcess = spawn("python3", [
          "/Users/zzenninkim/Documents/Research/sign-segmentation/demo/e2e_newseg2rec.py",
          "--video_path",
          videoPath,
          "--save_path",
          "/Users/zzenninkim/Documents/Research/sign-segmentation/demo/results"ßß,
          "--save_segments"

      ]);*/
      pythonProcess = spawn("python3", [
        "C:\Users\calyp\OneDrive\Documents\GitHub\krishnanmclaren-capstone\asl-website\backend.py",
        "--video",
        videoPath,
      ]);

  } else if (req.body.scriptName === "find-a-sign") {
    console.log("start recognition! find-a-sign");
    const videoPath = req.file.path; // uploaded video path
    const start = parseFloat(req.body.start); 
    const end = parseFloat(req.body.end); 

    const output_file = path.join(
    path.dirname(videoPath),
    path.basename(videoPath, path.extname(videoPath)) + '.txt'
    );


    // create segment.txt
    const txtContent = `Start: ${start.toFixed(3)} sec, End: ${end.toFixed(3)} sec\n`;
    fs.writeFileSync(output_file, txtContent);

    console.log(`Created file: ${output_file}`);


    pythonProcess = spawn("python3", [
      "/Users/zzenninkim/Documents/Research/sl-wrapper-main/recognition_mod/e2e_recognition_stgcn.py",
      "--input_segtxt", output_file,
      "--video", videoPath]);

  } else {
    return res.status(400).json({ error: "Invalid scriptName provided." });
  }