import { IDocument } from "../models/document/document.interface";
import { IUser } from "../models/user/user.interface";

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
    console.log("generateFilePath -> userId = " + userId);
    const filePath = `./uploads/${userId}/${numberSequence}(${document.id}).${document.fileExtension}`;
    return filePath;
}