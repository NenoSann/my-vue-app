// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron"
import * as path from 'path';
contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    author: 'NenoSan',
    ping: () => ipcRenderer.invoke('ping')
})

contextBridge.exposeInMainWorld('storeUserInfo', {
    save: async (data: string) => {
        const result = await ipcRenderer.invoke('testFS', data);
        console.log(result);
    }
});

contextBridge.exposeInMainWorld('socket', {
    createSocket: async () => {
        const result = await ipcRenderer.invoke('socket')
        console.log('create result!', result);
    }
})