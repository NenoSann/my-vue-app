/**
 *  This module is used to send and controll the electron notification
 */
import { nativeImage, NativeImage, Notification } from "electron";
import { mainWindow } from "../main.ts";
export class NotificationController {
    private static avatarMap: Map<string, NativeImage> = new Map();
    public static async sendNotification(
        notificationBody: string,
        notificationTitle: string,
        iconUrl: string,
    ) {
        // if the mainWindow is showing, then now show the notification
        console.log(
            "debug: notification: ",
            notificationBody,
            notificationTitle,
            iconUrl,
        );
        if (!mainWindow?.isVisible()) {
            console.log("sending notification...");
            let userAvatar: NativeImage | null | undefined = null;
            if (this.avatarMap.has(iconUrl)) {
                userAvatar = this.avatarMap.get(iconUrl);
            } else {
                userAvatar = (await this.fetchAvatar(
                    iconUrl,
                )) as unknown as NativeImage;
                this.avatarMap.set(iconUrl, userAvatar);
            }
            this.showNotification(
                notificationBody,
                notificationTitle,
                userAvatar as unknown as NativeImage,
            );
        }
    }
    private static async fetchAvatar(iconUrl: string): Promise<NativeImage> {
        return new Promise<NativeImage>((resolve) => {
            fetch(iconUrl).then((res) => {
                res.arrayBuffer().then((aBuffer) => {
                    const avatarBuffer = Buffer.from(aBuffer);
                    resolve(nativeImage.createFromBuffer(avatarBuffer));
                });
            });
        });
    }
    private static showNotification(
        body: string,
        title: string,
        icon: NativeImage,
    ) {
        new Notification({
            body,
            title,
            silent: true,
            icon,
        }).show();
    }
}
