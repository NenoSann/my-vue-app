import COS from "cos-js-sdk-v5";
import { CosPath, CredentialData, queryTempCredential, queryCosPath } from "../../API/credential";
import { md5 } from "js-md5";
/**
 *  Cos模块用于向腾讯云的COS对象存储服务发送请求(主要是上传对象请求)
 */
export class Cos {
    private cosPath: CosPath;
    private SessionToken: string;
    cos: COS;
    constructor(SecretKey: string, SecretId: string, SessionToken: string) {
        (async () => {
            try {
                const res = await queryCosPath();
                this.cosPath = res;
                this.cos = new COS({
                    SecretKey,
                    SecretId,
                })
                this.SessionToken = SessionToken
            } catch (error) {
                console.error(error);
                throw new Error('fail at initiate Cos');
            }
        })();
    }

    /**
     * 
     * @param image 用于发送的图像，可以是单个/复数的File，也可以是一个FileList
     * @param loadingCallBack 在发送过程中调用的回调，可以获得发送的进度和速度
     */
    public async putImages(image: File[], loadingCallBack?: (percent: number, speed: number) => void, finishCallBack?: (ok: boolean) => void): Promise<string[]>
    public async putImages(image: File, loadingCallBack?: (percent: number, speed: number) => void, finishCallBack?: (ok: boolean) => void): Promise<string>
    public async putImages(image: FileList, loadingCallBack?: (percent: number, speed: number) => void, finishCallBack?: (ok: boolean) => void): Promise<string[]>
    public async putImages(image: File | File[] | FileList, loadingCallBack?: (percent: number, speed: number) => void, finishCallBack?: (ok: boolean) => void): Promise<string | string[]> {
        return new Promise<string[]>(async (resolve, reject) => {
            //首先查看credential是否过期
            if (Sts.checkCredentialValid()) {
                //重新获取临时token
                const {
                    tmpSecretId,
                    tmpSecretKey,
                    sessionToken } = await Sts.getCredential();
                this.cos = new COS({
                    SecretKey: tmpSecretKey,
                    SecretId: tmpSecretId,
                })
                this.SessionToken = sessionToken;
            }
            if (Array.isArray(image)) {
                if (image.length === 0) {
                    resolve([]);
                }
            } else if (image instanceof FileList) {
                const files: any = [];
                if (image.length === 0) {
                    resolve([]);
                }
                for (const file of image) {
                    const arrayBuffer = await file.arrayBuffer();
                    const type = file.type.split('/')[1];
                    const fileName = md5(arrayBuffer) + '.' + type;
                    files.push({
                        Bucket: this.cosPath.Bucket,
                        Region: this.cosPath.Region,
                        Body: file,
                        Key: this.cosPath.baseKey + fileName,
                        Headers: {
                            'Access-Control-Allow-Origin': '*',
                            'x-cos-security-token': this.SessionToken
                        }
                    });
                }
                const result = await this.cos.uploadFiles({
                    files,
                    SliceSize: 1024 * 1024 * 10,
                    onProgress: function (info) {
                        loadingCallBack ? loadingCallBack(Math.floor(info.percent * 100), info.speed) : undefined;
                    },
                    onFileFinish: function (err, data, options) {
                        if (err) {
                            finishCallBack ? finishCallBack(false) : undefined;
                            reject();
                        }
                        finishCallBack ? finishCallBack(true) : undefined;
                        console.log(data.Location);
                    },
                })
                const locations = result.files.map((file) => {
                    return 'http://' + file.data.Location;
                })
                resolve(locations)
            } else {
                const fileName = image.name;
                const config = {
                    Bucket: this.cosPath.Bucket,
                    Region: this.cosPath.Region,
                    Body: image,
                    Key: this.cosPath.baseKey + fileName
                }
                console.log(config);
            }
        })
    }

    private async checkImage(fileName: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            if (Sts.checkCredentialValid()) {
                //重新获取临时token
                const {
                    tmpSecretId,
                    tmpSecretKey,
                    sessionToken } = await Sts.getCredential();
                this.cos = new COS({
                    SecretKey: tmpSecretKey,
                    SecretId: tmpSecretId,
                })
                this.SessionToken = sessionToken;
            }
            this.cos.headObject({
                Bucket: this.cosPath.Bucket,
                Region: this.cosPath.Region,
                Key: this.cosPath.baseKey + fileName
            }, (err, data) => {
                if (data) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
        })
    }
}

/**
 *  CredentialGenerator模块用于向服务器请求临时的密钥来进行存储服务，密钥是有时效的，如果密钥过期了模块会自动调用
 *  请求服务来重新获得密钥。
 *  
 */
export class CredentialGenerator {
    localStorageKey = 'stsCredential';
    private credential: CredentialData;
    constructor() {
        try {
            //首先尝试从LocalStorage中读取Credential
            //如果没有的话，向API请求
            const credential = this.getCredentialFromStorage();
            credential ? this.credential = credential : this.getCredentialFromAPI();
        } catch (error) {
            throw new Error('error on initiate CredentialGenerator.');
        }
    }

    public async getCredential() {
        //如果凭证已经过期，则向API请求新的凭证
        if (this.checkCredentialValid()) {
            await this.getCredentialFromAPI();
        }
        return this.credential.credentials;
    }

    private storeCredentialToStorage() {
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.credential));
    }

    private getCredentialFromStorage(): CredentialData | null {
        const credentialString = localStorage.getItem(this.localStorageKey);
        return credentialString ? JSON.parse(credentialString) as CredentialData : null;
    }
    public checkCredentialValid() {
        const expiredDate = new Date(this.credential?.expiredTime * 1000);
        const currentDate = new Date();
        return (currentDate >= expiredDate);
    }
    private async getCredentialFromAPI() {
        try {
            const res = await queryTempCredential();
            this.credential = res;
            this.storeCredentialToStorage();
        } catch (error) {
            // Handle API request errors here
            console.error('Error retrieving credentials from API:', error);
            throw new Error('Error retrieving credentials from API.');
        }
    }
}

let Sts: CredentialGenerator;
let cos: Cos;
try {
    Sts = new CredentialGenerator();
    const {
        tmpSecretId,
        tmpSecretKey,
        sessionToken } = await Sts.getCredential();
    cos = new Cos(tmpSecretKey, tmpSecretId, sessionToken);
    console.log(Sts, cos)
} catch (error) {
    console.log('cos and sts failed');
}
export { cos }