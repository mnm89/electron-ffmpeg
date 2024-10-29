import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  selectVideo: () => ipcRenderer.invoke("select-video"),
  startStreaming: (filePath: string) =>
    ipcRenderer.send("start-streaming", filePath),
  onMediaFileSaved: (callback: (data: string) => void) =>
    ipcRenderer.on("media-file-saved", (event, filePath) => callback(filePath)),
});
