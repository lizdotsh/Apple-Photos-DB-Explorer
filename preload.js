const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  'myAPI', {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
    invoke: (channel, data) => ipcRenderer.invoke(channel, data)
  }
);