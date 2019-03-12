import { Document } from "../entity/document";
import * as fs from 'fs';
import { generateFilePath } from "../libs/generateFilePath";

export default async function getDocumentFile(req: any, res: any) {
    const documentId: number = parseInt(req.params.docID);
    if(documentId == null) {
        res.status(400).send();
        return;
    }

    const doc: Document = await Document.findOne({ where: { uid: documentId }});
    const filepath = generateFilePath(doc);
    res.download(filepath, `${doc.title}.${doc.fileExtension}`);
}