import { Request, Response } from "express";
import * as mongoose from "mongoose";
import { User } from "../models/user/user.model";
import { Document } from "../models/document/document.model";
import { CustomRequest } from "../lib/jwt";

export default async function getDocument(req: CustomRequest, res: Response) {
    try {
        const user = await User.findOne({ id: req.userID });
        const documentId = req.header("documentId");
        const document = await Document.findOne({ _id: mongoose.Types.ObjectId(documentId), user: user }).exec();
        res.status(200).send({
            document: document
        });
        console.log(`getDocument: returning document -${document.title}-`);
        return true;
    } catch(err) {
        console.error(err);
        res.status(500).send({error: "Please see console output for error message."})
    }
}