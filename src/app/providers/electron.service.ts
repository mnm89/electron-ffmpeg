import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as ffmpeg from 'fluent-ffmpeg';
import { AppConfig } from '../../environments/environment';

@Injectable()
export class ElectronService {

  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;
  path: typeof path;
  ffmpeg : typeof ffmpeg;

  constructor() {
    // Conditional imports
    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;
      this.path=window.require('path');
      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
      this.ffmpeg=window.require('fluent-ffmpeg')
      
      var ffmpegPath = window.require('@ffmpeg-installer/ffmpeg').path;
      var ffprobePath = window.require('@ffprobe-installer/ffprobe').path;


      this.ffmpeg.setFfmpegPath(AppConfig.production ? ffmpegPath.replace('app.asar', 'app.asar.unpacked'):ffmpegPath );
      this.ffmpeg.setFfprobePath(AppConfig.production ? ffprobePath.replace('app.asar', 'app.asar.unpacked'):ffprobePath );

    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  }

  ffprobe=(path):Promise<any>=>{
    return new Promise((resolve,reject)=>{
      this.ffmpeg.ffprobe(this.path.resolve(path),(err,data)=>{
        if(err) return reject(err)
        return resolve(data)
      })
    })
  }

}
