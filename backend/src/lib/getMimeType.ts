import * as mime from 'mime-types';

export function getMimeType(fileName: string): string {
    const mimeType = mime.lookup(fileName);
    if(mimeType == "false") {
        return "unknown";
    }
    return mimeType.toString();
}