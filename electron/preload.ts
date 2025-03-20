import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    openPresentationWindow: () => ipcRenderer.send('open-presentation-window'),
    setPresentationData: (data: any) => ipcRenderer.send('set-presentation-data', data),
    setBackgroundColor: (color: string) => ipcRenderer.send('set-background-color', color),
    setBackgroundImage: (image: string) => ipcRenderer.send('set-background-image', image),
    onPresentationData: (callback: (data: any) => void) => ipcRenderer.on('presentation-data', (_event, data) => callback(data)),
    onBackgroundColor: (callback: (color: string) => void) => ipcRenderer.on('background-color', (_event, color) => callback(color)),
    onBackgroundImageSet: (callback: (image: string) => void) => ipcRenderer.on('background-image', (_event, image) => callback(image)),
    removeListener: (channel: string, callback: (data: any) => void) => ipcRenderer.removeListener(channel, callback)
});