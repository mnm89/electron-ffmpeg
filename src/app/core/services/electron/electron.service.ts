import { Injectable } from "@angular/core";

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame } from "electron";
import * as childProcess from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as ffmpeg from "fluent-ffmpeg";
import { APP_CONFIG } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ElectronService {
  ipcRenderer!: typeof ipcRenderer;
  webFrame!: typeof webFrame;
  childProcess!: typeof childProcess;
  fs!: typeof fs;
  path!: typeof path;
  ffmpeg!: typeof ffmpeg;

  constructor() {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = (window as any).require("electron").ipcRenderer;
      this.webFrame = (window as any).require("electron").webFrame;
      this.fs = (window as any).require("fs");
      this.path = window.require("path");
      this.childProcess = (window as any).require("child_process");
      this.childProcess.exec("node -v", (error, stdout, stderr) => {
        if (error) {
          console.error(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout:\n${stdout}`);
      });
      this.ffmpeg = window.require("fluent-ffmpeg");
      var ffmpegPath = window.require("@ffmpeg-installer/ffmpeg").path;
      var ffprobePath = window.require("@ffprobe-installer/ffprobe").path;

      this.ffmpeg.setFfmpegPath(
        APP_CONFIG.production
          ? ffmpegPath.replace("app.asar", "app.asar.unpacked")
          : ffmpegPath
      );
      this.ffmpeg.setFfprobePath(
        APP_CONFIG.production
          ? ffprobePath.replace("app.asar", "app.asar.unpacked")
          : ffprobePath
      );
    }
  }

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }
  ffprobe = (path: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.ffmpeg.ffprobe(this.path.resolve(path), (err, data) => {
        if (err) return reject(err);
        return resolve(data);
      });
    });
  };
}
