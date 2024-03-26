// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron"
import type { PrivateMessage } from "./Interface/user";
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
    // send
    createSocket: (...args) => {
        try {
            ipcRenderer.invoke('socket:create', ...args);
            return true;
        } catch (error) {
            console.error(error);
        }
    },
    getUserMap: () => ipcRenderer.invoke('socket:getUserMap'),
    close: () => ipcRenderer.send('socket:close'),
    sendPrivateMessage: (...args) => ipcRenderer.invoke('socket:privateMessage', ...args),
    // received
    onConnect: (callback: Function) => ipcRenderer.on('connect', (_event, val) => callback(val)),
    onUserConnected: (callback: Function) => ipcRenderer.on('userConnected', (_event, val) => {
        callback(val);
    }),
    onUserDisconnected: (callback: Function) => ipcRenderer.on('userDiconnected', (_event, val) => callback(val)),
    onClose: (callback: Function) => ipcRenderer.on('close', (_event, val) => callback(val)),
    onUserMap: (callback: Function) => ipcRenderer.on('usermap', (_event, usermap) => callback(usermap)),
    onPrivateMessage: (callback: Function) => ipcRenderer.on('privateMessage', (_event, from: string, message: PrivateMessage) => callback(from, message))
})