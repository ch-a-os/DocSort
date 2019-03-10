import { Request, Response } from "express";
import { Document } from "../entity/document";
import { User } from "../entity/user";
import { getUserIDFromJWT } from "../libs/getUserIDFromJWT";

export default async function getDocument(req: Request, res: Response) {
    try {
        const userId = getUserIDFromJWT(req.headers.token.toString());
        const user = await User.findOne({ where: { id: userId }});
        const documentId = parseInt(req.header("documentId"));
        const document = await Document.findOne({ where: { uid: documentId, user: user }});
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