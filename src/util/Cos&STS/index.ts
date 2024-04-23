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
    public async putImage(image: File[]): Promise<string[]>
    public async putImage(image: File): Promise<string>
    public async putImage(image: FileList): Promise<string[]>
    public async putImage(image: File | File[] | FileList): Promise<string | string[]> {
        return new Promise<string>(async (resolve, reject) => {
            if (Array.isArray(image)) {

            } else if (image instanceof FileList) {
                const files: any = [];
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
                        var percent = parseInt(info.percent * 10000) / 100;
                        var speed = parseInt(info.speed / 1024 / 1024 * 100) / 100;
                        console.log('进度：' + percent + '%; 速度：' + speed + 'Mb/s;');
                    },
                    onFileFinish: function (err, data, options) {
                        console.log(options.Key + '上传' + (err ? '失败' : '完成'));
                    },
                })
                console.log(result);
            }
            else {
                const fileName = image.name;
                const config = {
                    Bucket: this.cosPath.Bucket,
                    Region: this.cosPath.Region,
                    Body: image,
                    Key: this.cosPath.baseKey + fileName
                }
                console.log(config);
            }

            // this.cos.uploadFile({
            //     Bucket: this.cosPath.Bucket,
            //     Region: this.cosPath.Region,
            //     Body: image,
            //     Key: this.cosPath.baseKey + fileName
            // })
        })
    }
}

/**
 *  CredentialGenerator模块用于向服务器请求临时的密钥来进行存储服务，密钥是有时效的，如果密钥过期了模块会自动调用
 *  请求服务来重新获得密钥。
 */
export class CredentialGenerator {
    localStorageKey = 'stsCredential';
    credential: CredentialData;
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
        const expiredDate = new Date(this.credential?.expiredTime);
        const currentDate = new Date();
        //如果凭证已经过期，则向API请求新的凭证
        if (currentDate >= expiredDate) {
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