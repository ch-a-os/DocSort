import { IDocument } from "../models/document/document.interface";

export function generateFilePath(document: IDocument) {
    let numberSequence: string = document.number.primary.toString();
    if(document.number.secondary != null) {
        numberSequence += `.${document.number.secondary}`;
    }
    let userId = "";;
    if(document.populated("user_R") == null) {
        userId = document.user_R.toString();
    } else {
        userId = document.user_R.id;
    }
    console.log("generateFilePath -> userId = " + userId);
    //const filePath = `./uploads/${userId}/${numberSequence}_(${document.id}).${document.fileExtension}`;
    const filePath = `./uploads/${userId}/${numberSequence}.${document.fileExtension}`;
    return filePath;
}