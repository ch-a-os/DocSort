import { IDocument } from "../models/document/document.interface";

export function generateFilePath(document: IDocument) {
    let numberSequence: string = document.number.primary.toString();
    if(document.number.secondary != null) {
        numberSequence += `.${document.number.secondary}`;
    }
    const filePath = `../uploads/${document.get("user_R")}/${document.id}_${numberSequence}.${document.fileExtension}`;
    return filePath;
}