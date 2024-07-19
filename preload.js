const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('myAPI', {
  // Your exposed APIs
});
