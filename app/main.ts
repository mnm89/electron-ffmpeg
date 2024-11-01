import { app, BrowserWindow } from "electron";
import * as path from "path";
import * as fs from "fs";
import { createWindow, configureMenu } from "./services/window.service";
import "./services/ipc.service";

let mainWindow: BrowserWindow | null = null;

const args = process.argv.slice(1),
  serve = args.some((val) => val === "--serve");

app.on("ready", async () => {
  await new Promise((res) => setTimeout(res, 400));
  mainWindow = createWindow();
  configureMenu(mainWindow);
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
});

app.on("window-all-closed", () => {
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
