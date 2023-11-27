declare global {
    interface Window {
        storeUserInfo: {
            save: (data: any) => Promise<string>;
        };
    }
}

export { Window }