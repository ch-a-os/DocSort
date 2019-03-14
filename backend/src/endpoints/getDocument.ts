import { Request, Response } from "express";
import { User } from "../models/user/user.model";
import { Document } from "../models/document/document.model";
import { getUserIDFromJWT } from "../lib/getUserIDFromJWT";

export default async function getDocument(req: Request, res: Response) {
    try {
        const userId = getUserIDFromJWT(req.header("token"));
        const user = await User.findOne({ id: userId });
        const documentId = parseInt(req.header("documentId"));
        const document = await Document.findOne({ uid: documentId, user: user }).exec();
        console.log("debug1:" + userId);
        console.log("debug2:" + documentId);
        console.log("debug3:" + JSON.stringify(document));
        res.status(200).send({
            document: document
        });
        console.log("getDocument: returning document " + document.title);
        return true;
    } catch(err) {
        console.error(err);
        res.status(500).send({error: "Please see console output for error message."})
    }
}