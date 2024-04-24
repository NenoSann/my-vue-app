import * as fsP from 'node:fs/promises';
import jimp from 'jimp';
import path from 'path'
const MAX_IMAGE_SIZE = 1024 * 1024;
export class BufferController {
    public static async readImageFromPath(imagePath: Array<string>, returnType: 'Buffer' | 'Base64'): Promise<Array<Buffer> | Array<string>>
    public static async readImageFromPath(imagePath: string, returnType: 'Buffer' | 'Base64'): Promise<Buffer | string>
    public static async readImageFromPath(imagePath: Array<string> | string, returnType: 'Buffer' | 'Base64'): Promise<string | string[] | Buffer | Buffer[]> {
        try {
            // handle single path, turn it into array
            if (!Array.isArray(imagePath)) {
                imagePath = [imagePath];
            }
            const buffers: Buffer[] = [];
            const base64: string[] = [];
            for (const path of imagePath) {
                const buffer = await fsP.readFile(path)
                if (buffer.byteLength > MAX_IMAGE_SIZE) {
                    const img = await jimp.read(buffer).then((img) => {
                        return img.scale(MAX_IMAGE_SIZE / buffer.byteLength)
                    })
                    const scaledImg = await img.getBufferAsync(img.getMIME());
                    buffers.push(scaledImg);
                } else {
                    buffers.push(buffer);
                }
            };
            if (returnType === 'Base64') {
                // using jimp to read gif base64 will cause git not animated
                for (let [index, buffer] of buffers.entries()) {
                    const extname = path.extname(imagePath[index]).slice(1);
                    const mimeType = `image/${extname}`;
                    base64.push(this.bufferToBase64(buffer, mimeType));
                }
                return base64;
            }
            return buffers;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    private static handleError(error: any) {
        console.error(error);
    }

    /**
     * take in buffer and mimeType, convert the buffer to base64 string
     * @param buffer 
     * @param mimeType 
     */
    private static bufferToBase64(buffer: Buffer, mimeType: string): string {
        const base64String = buffer.toString('base64');
        const dataURI = `data:${mimeType};base64,${base64String}`;
        return dataURI;
    }
}