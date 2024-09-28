import { BrowserWindow } from "electron";

export class WindowsController {
    public createWindow() {
        const window = new BrowserWindow({
            title: undefined,
            width: 800,
            height: 600,
            minHeight: 600,
            minWidth: 800,
            autoHideMenuBar: true,
            icon: undefined, // Set the icon path to an empty string or remove this line if you don't want an icon
        });
        window.setSkipTaskbar(true);
        // Load the desired URL or local file
        window.loadURL("https://Google.com");
        window.show();
    }

    // Other methods for managing windows...
}
