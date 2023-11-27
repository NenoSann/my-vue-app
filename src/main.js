"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var path = require("path");
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    electron_1.app.quit();
}
var createWindow = function () {
    // Create the browser window.
    var mainWindow = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        minHeight: 600,
        minWidth: 800,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });
    // and load the index.html of the app.
    //@ts-ignore
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        //@ts-ignore
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    }
    else {
        //@ts-ignore
        mainWindow.loadFile(path.join(__dirname, "../renderer/".concat(MAIN_WINDOW_VITE_NAME, "/index.html")));
    }
    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
};
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron_1.app.on('ready', createWindow);
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
