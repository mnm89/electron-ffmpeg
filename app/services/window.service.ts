import { BrowserWindow, dialog, Menu, screen } from "electron";
import * as path from "path";
import { ffmpegService } from "./ffmpeg.service";

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

export function createWindow(): BrowserWindow {
  const size = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      preload: path.join(__dirname, "preload.service.js"),
      contextIsolation: true,
      nodeIntegration: false,
      //TODO: Try to enable this and serve files with a http server from the main process
      // if will solve the not allowed resource issue when playing video files with file://....
      webSecurity: false,
    },
  });
  return mainWindow;
}

export function configureMenu(mainWindow: BrowserWindow) {
  // Get the existing application menu
  const existingMenu = Menu.getApplicationMenu();
  // Define a custom menu template
  const menuTemplate: Electron.MenuItemConstructorOptions[] =
    existingMenu?.items.map((item) => {
      // Override only the "File" menu item
      if (item.label !== "File") return item;
      return {
        label: "File",
        submenu: [
          {
            label: "New Video",
            click: async () => {
              const { canceled, filePaths } = await dialog.showOpenDialog({
                properties: ["openFile"],
                filters: [{ name: "Videos", extensions: VIDEO_EXTENSIONS }],
              });
              if (!canceled && filePaths[0])
                ffmpegService(mainWindow).convertMedia(filePaths[0]);
            },
          },
        ],
      };
    }) as Electron.MenuItemConstructorOptions[];
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}
