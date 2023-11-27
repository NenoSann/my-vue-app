"use strict";
exports.__esModule = true;
// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
var electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('versions', {
    node: function () { return process.versions.node; },
    chrome: function () { return process.versions.chrome; },
    electron: function () { return process.versions.electron; },
    author: 'NenoSan'
});
electron_1.contextBridge.exposeInMainWorld('storeUserInfo', {
    save: function () {
    }
});
