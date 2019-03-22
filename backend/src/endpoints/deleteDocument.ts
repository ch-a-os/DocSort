import * as fs from 'fs';
import { IUser } from "../models/user/user.interface";
import { User } from "../models/user/user.model";
import { getUserIDFromJWT } from "../lib/getUserIDFromJWT";
import { Document } from "../models/document/document.model";
import { generateFilePath } from '../lib/generateFilePath';

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
        res.status(401).send();
        return;
    }

    const doc = await Document.findById(toDelete);
    if(doc.user_R != user._id) {
        res.status(401).send();
    }
    
    // Delete file from disk
    fs.unlink(generateFilePath(doc), async (err) => {
        await doc.remove();
    
        res.status(200).send();
    })

    
}