const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  openFile: (options) => ipcRenderer.invoke('open-file-dialog', options),
  openDirectory: () => ipcRenderer.invoke('open-directory-dialog')
}); 