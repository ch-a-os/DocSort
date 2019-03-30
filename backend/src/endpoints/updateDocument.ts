import { IUser } from "../models/user/user.interface";
import { User } from "../models/user/user.model";
import { IDocument } from "../models/document/document.interface";
import { Document } from "../models/document/document.model";
import { getUserIDFromJWT } from "../lib/jwt";

export default async function updateDocument(req, res) {
    const user: IUser = await User.findById(getUserIDFromJWT(req.headers.token)).exec();
    const changedDoc: IDocument = req.body;
    
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