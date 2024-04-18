import * as fsP from 'node:fs/promises';
import path from 'path'
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
                buffers.push(await fsP.readFile(path));
            };
            if (returnType === 'Base64') {
                for (const [index, buffer] of buffers.entries()) {
                    const mimeType = `image/${path.extname(imagePath[index]).slice(1)}`;
                    base64.push((this.bufferToBase64(buffer, mimeType)));
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