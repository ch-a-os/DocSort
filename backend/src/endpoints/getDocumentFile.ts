import * as fs from 'fs';

import { Document } from "../models/document/document.model";
import { IDocument } from "../models/document/document.interface";
import { generateFilePath } from '../lib/generateFilePath';

export default async function getDocumentFile(req: any, res: any) {
    const documentId: number = parseInt(req.header("documentId"));
    if(documentId == null) {
        res.status(400).send();
        return;
    }

    const doc: IDocument = await Document.findOne({ id: documentId }).select('user_R number');
    const filepath = generateFilePath(doc);
    const docFile = fs.readFileSync(filepath);
    res.status(200).send(docFile);
}