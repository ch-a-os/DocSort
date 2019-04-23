import { IDocument } from "../models/document/document.interface";
import { IUser } from "../models/user/user.interface";
import * as fs from "fs";
import * as mime from 'mime-types';

export function generateFilePath(document: IDocument) {
    let numberSequence: string = document.number.primary.toString();
    if(document.number.secondary != null) {
        numberSequence += `.${document.number.secondary}`;
    }
    let userId = "";
    if(document.populated("user_R") == null) {
        userId = document.user_R.toString();
    } else {
        userId = (document.user_R as IUser)._id;
    }
    const filePath = `./uploads/${userId}/${numberSequence}(${document.id}).${document.fileExtension}`;
    return filePath;
}

export function extractFileExtension(fileName: string): string {
    return fileName.split(".").pop();
}

export async function getDocumentBuffer(doc: IDocument): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
        fs.readFile(generateFilePath(doc), (err, data) => {
            if(err) reject(err);
            resolve(data);
        })    
    })
}

export function getMimeType(fileName: string): string {
    const mimeType = mime.lookup(fileName);
    if(mimeType == "false") {
        return "unknown";
    }
    return mimeType.toString();
}