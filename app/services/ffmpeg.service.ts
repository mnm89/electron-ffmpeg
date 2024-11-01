import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import * as ffmpegPath from "@ffmpeg-installer/ffmpeg";
import * as ffmpeg from "fluent-ffmpeg";
import { app, BrowserWindow } from "electron";

export const outputDirectoryPath = path.join(app.getPath("videos"), "medias");

if (!fs.existsSync(outputDirectoryPath)) {
  fs.mkdirSync(outputDirectoryPath);
}
export const ffmpegService = (mainWindow: BrowserWindow) => ({
  convertMedia: (inputFilePath: string) => {
    console.log("Starting media stream for file:", inputFilePath);
    const filename = path.basename(inputFilePath, path.extname(inputFilePath));
    const id = crypto.randomUUID();
    const outputFileName = `${filename}-${id}.mp4`;
    const outputFilePath = path.join(outputDirectoryPath, outputFileName);

    // Convert video frames
    ffmpeg(inputFilePath)
      .setFfmpegPath(ffmpegPath.path)
      .videoCodec("libx264") // Use H.264 codec for MP4
      .audioCodec("aac") // AAC codec for audio
      .videoBitrate("3000k") // Set a higher bitrate for quality (adjust as needed)
      .audioBitrate("192k") // Higher bitrate for better audio quality
      .size("1280x720")
      .addOutputOption("-preset", "slow")
      .addOutputOption("-crf", "18")
      .addOutputOption("-v", "verbose")
      .on("start", () => console.log("Video streaming started"))
      .on("end", () => {
        console.log("Media saved successfully");
        mainWindow?.webContents.send("media-file-saved", outputFilePath);
      })
      .on("progress", (progress) => {
        mainWindow?.webContents.send("media-file-progress", progress);
      })
      .on("error", (err, stdout, stderr) => {
        console.error("Error during conversion:", err.message);
        //console.log(stderr);
        mainWindow?.webContents.send("media-file-error", err);
      })
      .save(outputFilePath);
  },
});
