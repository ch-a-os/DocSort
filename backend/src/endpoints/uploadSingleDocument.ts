import * as fs from "fs";
import * as mongoose from 'mongoose';
import { Request, Response } from "express";
import { Document } from "../models/document/document.model";
import { User } from "../models/user/user.model";
import { IDocument } from "../models/document/document.interface";
import { extractFileExtension, generateFilePath } from "../lib/documentOperations";
import { getNextPrimaryNumber } from "../lib/userUtils";
import { ModifiedRequest } from "../lib/jwt";
import { log } from "../lib/logging";
import { formatError } from "../lib/errorHandler";

export default async function uploadSingleDocument(req: ModifiedRequest, res: Response) {
    try {
        log.info("uploadDocument was called");
        if (!fs.existsSync("./uploads")) {
            fs.mkdirSync("./uploads");
        }

        //const userId = getUserIDFromJWT(req.header("token"));
        const userId = req.userID;
        const user = await User.findOne({ _id: userId }).populate("tags_R").exec();
        const nextPrimaryNumber = await getNextPrimaryNumber(userId);

        log.info("req.body=" + JSON.stringify(req.body));
        const uploadDocument: IUploadDocument = JSON.parse(req.body.document);
        const uploadFile: Express.Multer.File = req.file;

        const newDocument: IDocument = new Document();
        newDocument.number = {};
        newDocument.number.primary = nextPrimaryNumber;

        newDocument.title = uploadDocument.title;
        newDocument.note = uploadDocument.note;
        newDocument.user_R = user;
        newDocument.mimeType = uploadFile.mimetype;

        if(uploadDocument.textRecognition != null) {
            newDocument.textRecognition = {};
            newDocument.textRecognition.enabled = uploadDocument.textRecognition.enabled;
            newDocument.textRecognition.finished = uploadDocument.textRecognition.finished;
        }
        
        newDocument.fileExtension = extractFileExtension(req.file.originalname);

        // Setting up TAGs
        newDocument.tags_R = uploadDocument.tags_R.map(entry => mongoose.Types.ObjectId(entry));
        
        await newDocument.save();

        const filePath = generateFilePath(newDocument);
        fs.writeFileSync(filePath, req.file.buffer);
        
        log.info(`file written: ${filePath}`);
        await wait(4000);
        res.status(200).send({
            newID: newDocument.id
        });
    } catch(err) {
        formatError(err);
        res.status(500).send();
    }
}

async function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

interface IUploadDocument {
    number: {
        primary?: number;
        secondary?: number;
    };
    title?: string;
    note?: string;
    fileExtension?: string;
    tags_R?: Array<string>;
    mimeType?: string;
    textRecognition?: {
        enabled?: boolean;
        finished?: boolean;
        content?: string;
    }
}