import * as fs from "fs";
import { Request, Response } from "express";
import { Document } from "../models/document/document.model";
import { User } from "../models/user/user.model";
import { Tag } from "../models/tag/tag.model";
import { getNextPrimaryNumber } from "../lib/getNextPrimaryNumber";
import { getUserIDFromJWT } from "../lib/getUserIDFromJWT";
import { generateFilePath } from "../lib/generateFilePath";
import extractFileExtension from "../lib/extractFileExtension";
import { IDocument } from "../models/document/document.interface";

interface IRequestTag {
    name: string;
    logo?: string;
    colorForeground?: string;
    colorBackground?: string;
}

interface IRequestBody {
    title: string;
    note: string;
    tags: string;
}

export default async function uploadSingleDocument(req: Request, res: Response) {
    try {
        console.log("uploadDocument wurde aufgerufen");
        if (!fs.existsSync("./uploads")) {
            fs.mkdirSync("./uploads");
        }

        const userId = getUserIDFromJWT(req.header("token"));
        const user = await User.findOne({ id: userId }).populate("tags_R").exec();
        const nextPrimaryNumber = await getNextPrimaryNumber(userId);

        const requestBody: IRequestBody = req.body;
        const file: Express.Multer.File = req.file;

        const document: IDocument = new Document();
        document.number.primary = nextPrimaryNumber;

        document.title = requestBody.title;
        document.note = requestBody.note;
        document.user_R = user;
        document.mimeType = file.mimetype;
        document.textRecognition.enabled = false;
        document.textRecognition.finished = false;
        document.fileExtension = extractFileExtension(req.file.originalname);

        // Setting up TAGs
        const givenTags: Array<IRequestTag|number> = JSON.parse(requestBody.tags);
        if(givenTags != null) {
            document.tags_R = new Array();
            for (const tag of givenTags) {
                if(typeof tag == "number") {
                    let existingTag = await Tag.findOne({ id: tag });
                    if(existingTag != null) {
                        document.tags_R.push(existingTag);
                    }
                } else {
                    let newTag = new Tag();
                    console.log("debug-tag=" + JSON.stringify(tag));
                    newTag.name = tag.name;
                    if(tag.logo != null) {
                        newTag.style.logo = tag.logo;
                    }
                    if(tag.colorBackground != null) {
                        newTag.style.colorBackground = tag.colorBackground;
                    }
                    if(tag.colorForeground != null) {
                        newTag.style.colorForeground = tag.colorForeground;
                    }
                    user.tags_R.push(newTag);
                    //newTag.user_R = user;
                    await newTag.save();
                    await user.save();
                    document.tags_R.push(newTag);
                }
            }
        }
        
        await document.save();

        const filePath = generateFilePath(document);
        fs.writeFileSync(filePath, req.file.buffer);
        
        console.log(`file written: ${filePath}`);
        await wait(4000);
        res.status(200).send({
            newID: document.id
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