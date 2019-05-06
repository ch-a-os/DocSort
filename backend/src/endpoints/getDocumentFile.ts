import { Document } from "../models/document/document.model";
import { IDocument } from "../models/document/document.interface";
import * as mongoose from 'mongoose';
import { generateFilePath } from "../lib/documentOperations";
import { formatError, ApplicationError, ERROR } from "../lib/errorHandler";

export default async function getDocumentFile(req: any, res: any) {
    try {
        const documentId: mongoose.Types.ObjectId = req.params.docID;
        if(documentId == null) {
            res.status(400).send();
            return;
        }
    
        const doc: IDocument = await Document.findById(documentId, 'title fileExtension user_R number');
        const filepath = generateFilePath(doc);
        res.download(filepath, `${doc.number.primary}.${doc.number.secondary}_${doc.title}.${doc.fileExtension}`);
    } catch(err) {
        if(res.headersSent) formatError(err);
        else {
            formatError(new ApplicationError(ERROR.UncaughtError, err.message, res));
        }
    }
}