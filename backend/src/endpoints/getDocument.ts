import { Response } from 'express';
import * as mongoose from 'mongoose';

import { ModifiedRequest } from '../lib/jwt';
import { Document } from '../models/document/document.model';
import { User } from '../models/user/user.model';
import { log } from '../lib/logging';
import { ApplicationError } from '../lib/applicationError';

export default async function getDocument(req: ModifiedRequest, res: Response) {
    try {
        const userId = req.userID;
        const user = await User.findOne({ id: userId });
        const documentId = req.header("documentId");
        const document = await Document.findOne({ _id: mongoose.Types.ObjectId(documentId), user: user }).exec();

        res.status(200).send({
            document: document
        });
        return true;
    } catch(error) {
        throw new ApplicationError("error in getDocument", error);
    }
}