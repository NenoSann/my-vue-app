import { dialog, OpenDialogOptions, BrowserWindow } from "electron";
export class DialogController {
    public static openSelectFileDialog(window?: BrowserWindow) {
        const dialogOption: OpenDialogOptions = {
            properties: ["multiSelections", "openFile"],
        };
        if (window) {
            return dialog.showOpenDialog(window, dialogOption);
        } else {
            return dialog.showOpenDialog(dialogOption);
        }
    }

    public static openSelectImageDialog(window?: BrowserWindow) {
        const dialogOption: OpenDialogOptions = {
            properties: ["multiSelections", "openFile"],
            filters: [
                { name: "Images", extensions: ["jpg", "png", "gif", "jpeg"] },
            ],
        };
        if (window) {
            return dialog.showOpenDialog(window, dialogOption);
        } else {
            return dialog.showOpenDialog(dialogOption);
        }
    }
}
