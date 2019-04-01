import * as fs from 'fs';
import { IUser } from "../models/user/user.interface";
import { User } from "../models/user/user.model";
import { Document } from "../models/document/document.model";
import { getUserIDFromJWT } from '../lib/jwt';
import { generateFilePath } from '../lib/documentOperations';

export default async function deleteDocument(req, res) {
    const user: IUser = await User.findById(getUserIDFromJWT(req.headers.token)).exec();
    const toDelete: string = req.body.id;
    
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

    
}