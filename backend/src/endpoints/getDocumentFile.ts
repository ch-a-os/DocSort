import { Document } from "../models/document/document.model";
import { IDocument } from "../models/document/document.interface";
import { generateFilePath } from '../lib/generateFilePath';
import * as mongoose from 'mongoose';

export default async function getDocumentFile(req: any, res: any) {
    console.log("Address line:", req.originalUrl);
    const documentId: mongoose.Types.ObjectId = req.params.docID;
    if(documentId == null) {
        res.status(400).send();
        return;
    }

    console.log("DocID:", documentId);
    const doc: IDocument = await Document.findById(documentId, 'title fileExtension user_R number');
    console.log(doc);
    console.log("Selected fields:", doc.toString());
    const filepath = generateFilePath(doc);
    res.download(filepath, `${doc.title}.${doc.fileExtension}`);
}