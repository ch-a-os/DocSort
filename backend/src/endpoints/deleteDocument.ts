import * as fs from 'fs';
import { Document } from "../models/document/document.model";
import { generateFilePath } from '../lib/documentOperations';
import { ModifiedRequest } from '../lib/jwt';
import { formatError, ApplicationError, ERROR } from '../lib/errorHandler';

export default async function deleteDocument(req: ModifiedRequest, res) {
    try {
        const toDelete: string = req.body.id;
        const user = req.user;
        
        // Check If body exist
        if(toDelete == null) {
            res.status(400).send();
            return;
        }

        // Check If user was found
        if(user == null) {
            res.status(400).send();
            return;
        }

        const doc = await Document.findById(toDelete);
        if(doc.user_R.toString() != user._id.toString()) {
            res.status(401).send();
            return;
        }
        
        // Delete file from disk
        fs.unlink(generateFilePath(doc), async (err) => {
            await doc.remove();
        
            res.status(200).send();
        })
    } catch(err) {
        if(res.headersSent) formatError(err);
        else {
            formatError(new ApplicationError(ERROR.UncaughtError, err.message, res));
        }
    }
    
}