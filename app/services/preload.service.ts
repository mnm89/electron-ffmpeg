import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  getVideos: () => ipcRenderer.invoke("get-videos"),
  onMediaFileSaved: (callback: (data: string) => void) =>
    ipcRenderer.on("media-file-saved", (event, filePath) => callback(filePath)),
  onMediaFileProgress: (callback: (data: string) => void) =>
    ipcRenderer.on("media-file-progress", (event, progress) =>
      callback(progress)
    ),
  onMediaFileError: (callback: (data: string) => void) =>
    ipcRenderer.on("media-file-error", (event, error) => callback(error)),
});
