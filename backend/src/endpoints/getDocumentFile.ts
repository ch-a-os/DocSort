import { Document } from "../models/document/document.model";
import { IDocument } from "../models/document/document.interface";
import { generateFilePath } from '../lib/generateFilePath';

export default async function getDocumentFile(req: any, res: any) {
    const documentId: number = parseInt(req.params.docID);
    if(documentId == null) {
        res.status(400).send();
        return;
    }

    const doc: IDocument = await Document.findOne({ id: documentId }, 'title fileExtension user_R number');
    console.log("Selected fields:", doc.toString());
    const filepath = generateFilePath(doc);
    res.download(filepath, `${doc.title}.${doc.fileExtension}`);
}