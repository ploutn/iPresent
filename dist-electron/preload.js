import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("electronAPI", {
  openPresentationWindow: () => ipcRenderer.send("open-presentation-window"),
  setPresentationData: (data) => ipcRenderer.send("set-presentation-data", data),
  setBackgroundColor: (color) => ipcRenderer.send("set-background-color", color),
  setBackgroundImage: (image) => ipcRenderer.send("set-background-image", image),
  onPresentationData: (callback) => ipcRenderer.on("presentation-data", (_event, data) => callback(data)),
  onBackgroundColor: (callback) => ipcRenderer.on("background-color", (_event, color) => callback(color)),
  onBackgroundImageSet: (callback) => ipcRenderer.on("background-image", (_event, image) => callback(image)),
  removeListener: (channel, callback) => ipcRenderer.removeListener(channel, callback)
});
