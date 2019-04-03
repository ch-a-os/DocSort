import * as fs from "fs";
import * as mongoose from 'mongoose';
import { Request, Response } from "express";
import { Document } from "../models/document/document.model";
import { User } from "../models/user/user.model";
import { IDocument } from "../models/document/document.interface";
import { getUserIDFromJWT } from "../lib/jwt";
import { extractFileExtension, generateFilePath } from "../lib/documentOperations";
import { getNextPrimaryNumber } from "../lib/userUtils";
import { ModifiedRequest } from "../lib/jwt";

export default async function uploadSingleDocument(req: ModifiedRequest, res: Response) {
    try {
        console.log("uploadDocument wurde aufgerufen");
        if (!fs.existsSync("./uploads")) {
            fs.mkdirSync("./uploads");
        }

        const userId = getUserIDFromJWT(req.header("token"));
        const user = await User.findOne({ _id: userId }).populate("tags_R").exec();
        const nextPrimaryNumber = await getNextPrimaryNumber(userId);

        console.log("req.body=", req.body);
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
        const givenTags: Array<string> = uploadDocument.tags_R;
        console.log("Tag:", givenTags)
        if(uploadDocument.tags_R != null) {
            newDocument.tags_R = new Array();
            for (const tag of givenTags) {
                newDocument.tags_R.push(mongoose.Types.ObjectId(tag));
            }
        }
        
        await newDocument.save();

        const filePath = generateFilePath(newDocument);
        fs.writeFileSync(filePath, req.file.buffer);
        
        console.log(`file written: ${filePath}`);
        await wait(4000);
        res.status(200).send({
            newID: newDocument.id
        });
    } catch(err) {
        res.status(500).send({message: "Please see console output for error message."});
        console.error(err);
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