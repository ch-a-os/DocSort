import { Document } from "../models/document/document.model";
import { IDocument } from "../models/document/document.interface";
import mongoose from 'mongoose';
import { generateFilePath } from "../lib/documentOperations";

export default async function getDocumentFile(req: any, res: any) {
    const documentId: mongoose.Types.ObjectId = req.params.docID;
    if(documentId == null) {
        res.status(400).send();
        return;
    }

    const doc: IDocument = await Document.findById(documentId, 'title fileExtension user_R number');
    const filepath = generateFilePath(doc);
    res.download(filepath, `${doc.number.primary}.${doc.number.secondary}_${doc.title}.${doc.fileExtension}`);
}