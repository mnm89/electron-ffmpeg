import { app, BrowserWindow, dialog, ipcMain, screen } from "electron";
import * as path from "path";
import * as fs from "fs";

import * as ffmpegPath from "@ffmpeg-installer/ffmpeg";
import * as ffmpeg from "fluent-ffmpeg";

let mainWindow: BrowserWindow | null = null;
const args = process.argv.slice(1),
  serve = args.some((val) => val === "--serve");

const VIDEO_EXTENSIONS = [
  "3g2",
  "3gp",
  "aaf",
  "asf",
  "avchd",
  "avi",
  "drc",
  "flv",
  "m2v",
  "m4p",
  "m4v",
  "mkv",
  "mng",
  "mov",
  "mp2",
  "mp4",
  "mpe",
  "mpeg",
  "mpg",
  "mpv",
  "mxf",
  "nsv",
  "ogg",
  "ogv",
  "qt",
  "rm",
  "rmvb",
  "roq",
  "svi",
  "vob",
  "webm",
  "wmv",
  "yuv",
];

function createWindow() {
  const size = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  mainWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false,
    },
  });

  if (serve) {
    const debug = require("electron-debug");
    debug();

    require("electron-reloader")(module);
    mainWindow.loadURL("http://localhost:4200");
  } else {
    // Path when running electron executable
    let pathIndex = "./index.html";

    if (fs.existsSync(path.join(__dirname, "../dist/index.html"))) {
      // Path when running electron in local folder
      pathIndex = "../dist/index.html";
    }

    const url = new URL(path.join("file:", __dirname, pathIndex));
    mainWindow.loadURL(url.href);
  }

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}
function streamMedia(filePath: string) {
  if (!mainWindow || !filePath) return;

  console.log("Starting media stream for file:", filePath);

  const outputFilePath = path.join(app.getPath("temp"), "output.webm");

  // Stream video frames
  ffmpeg(filePath)
    .setFfmpegPath(ffmpegPath.path)
    .format("webm")
    .videoCodec("libvpx") // Use VP8 codec
    .audioCodec("libvorbis") // Use Vorbis codec for audio
    .addOption("-deadline", "realtime") // Optimize for real-time streaming
    .addOption("-cluster_size_limit", "5M") // Limit cluster size to 5 MB
    .addOption("-cluster_time_limit", "1000") // Limit cluster duration to 1 second
    .on("start", () => console.log("Video streaming started"))
    .on("end", () => {
      console.log("Media saved successfully");
      mainWindow?.webContents.send("media-file-saved", outputFilePath);
    })
    .on("error", (err) => {
      console.error("Error saving media:", err.message);
    })
    .save(outputFilePath);
}
// Function to open a file dialog and return the selected path
ipcMain.handle("select-video", async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Videos", extensions: VIDEO_EXTENSIONS }],
  });
  return canceled ? null : filePaths[0];
});

// Listen for the start of media streaming with a selected file path
ipcMain.on("start-streaming", (event, filePath) => {
  streamMedia(filePath);
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
app.on("ready", () => setTimeout(createWindow, 400));

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
