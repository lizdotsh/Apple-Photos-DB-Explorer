const { contextBridge, ipcRenderer } = require('electron'); 
//const { getPeople } = require('./people.js');
//const people = require('/src/models/people.js');
const api = {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron
}
// print working directory
//console.log(process.cwd())
//contextBridge.exposeInMainWorld('api', api)
//

contextBridge.exposeInMainWorld(
  'myAPI', {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
    invoke: (channel, data) => ipcRenderer.invoke(channel, data),
    sendSQL: (sqlQuery) => ipcRenderer.send('sql-query', sqlQuery),
    receiveSQLResults: (callback) => ipcRenderer.on('sql-results', (event, results) => callback(results))
  },
);

// contextBridge.exposeInMainWorld(
//     'db', {
//         getPeople: getPeople,
//     },
// );
