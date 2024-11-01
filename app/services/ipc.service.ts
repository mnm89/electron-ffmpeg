import { ipcMain } from "electron";
import * as fs from "fs";
import { outputDirectoryPath as videosPath } from "./ffmpeg.service";
import * as path from "path";

ipcMain.handle("get-videos", async () => {
  try {
    const videoFiles = fs.readdirSync(videosPath);
    return videoFiles.map((file) => path.join(videosPath, file));
  } catch (error) {
    console.error("Error reading videos directory:", error);
    return [];
  }
});
