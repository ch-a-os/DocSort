import { ModifiedRequest } from '../lib/jwt';
import { IDocument } from '../models/document/document.interface';
import { Document } from '../models/document/document.model';

export default async function updateDocument(req: ModifiedRequest, res) {
    const changedDoc: IDocument = req.body;
    const user = req.user;
    
    // Check If body exist
    if(changedDoc == null) {
        res.status(400).send();
        return;
    }

    // Check If user was found
    if(user == null) {
        res.status(401).send();
        return;
    }

    await Document.update({_id: changedDoc._id, user_R: user}, changedDoc).exec();

    res.status(200).send();
}