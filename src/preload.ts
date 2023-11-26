// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron"
import * as fs from 'node:fs/promises';

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    author: 'NenoSan'
})

contextBridge.exposeInMainWorld('storeUserInfo', {
    save: () => {

    }
})