import { Request, Response } from "express";
import { getUserIDFromJWT } from "../lib/getUserIDFromJWT";
import { User } from "../models/user/user.model";
import { Document } from "../models/document/document.model";
import { MongooseDocument } from "mongoose";
import * as mongoose from "mongoose";

export async function searchDocuments(req: Request, res: Response) {
    const userId = getUserIDFromJWT(req.headers.token.toString());
    const user = await User.findOne({ _id: userId });
    if(user == null) {
        console.log(`User with ID ${userId} does not exist in the database`);
        res.status(500).send();
        return;
    }
    let query = Document.where("user_R").equals(userId);

    // take
    const take = parseInt(req.header("option-take"), 10);
    if(isNaN(take) == false) {
        query.limit(take);
    } else {
        query.limit(10);
    }

    // order by
    const order = req.header("option-order-order");
    const field = req.header("option-order-field");
    if(field != null && order != null && (order == "ASC" || order == "DESC")) {
        let orderSymbol = "";
        if(order == "DESC") {
            orderSymbol = "-";
        }
        query.sort(`${orderSymbol}${field}`);
    } else {
        query.sort("createdAt");
    }

    // number-primary
    const numberPrimary = parseInt(req.header("option-where-number-primary"));
    if(isNaN(numberPrimary) == false) {
        query.where("number.primary").equals(numberPrimary);
    }

    // number-secondary
    const numberSecondary = parseInt(req.header("option-where-number-secondary"));
    if(isNaN(numberSecondary) == false) {
        query.where("number.secondary").equals(numberSecondary);
    }

    // fileExtension
    const fileExtension = req.header("option-where-fileextension");
    if(fileExtension != null) {
        query.where("fileExtension").equals(fileExtension);
    }

    // title
    const title = req.header("option-where-title");
    if(title != null) {
        query.where("title").regex(new RegExp(`${title}`));
    }

    // note
    const note = req.header("option-where-note");
    if(note != null) {
        query.where("note").regex(new RegExp(`${note}`));
    }

    // mimeType
    const mimeType = req.header("option-where-mimetype");
    if(mimeType != null) {
        query.where("mimeType").regex(new RegExp(`${mimeType}`));
    }

    // textRecognition-enabled
    const textRecognitionEnabled = req.header("option-where-textRecognition-enabled");
    if(textRecognitionEnabled == "true") {
        query.where("textRecognition.enabled").equals(true);
    } else if(textRecognitionEnabled == "false") {
        query.where("textRecognition.enabled").equals(false);
    }

    // textRecognition-finished
    const textRecognitionFinished = req.header("option-where-textRecognition-finished");
    if(textRecognitionFinished == "true") {
        query.where("textRecognition.finished").equals(true);
    } else if(textRecognitionFinished == "false") {
        query.where("textRecognition.finished").equals(false);
    }

    // textRecognition-content
    const textRecognitionContent = req.header("option-where-textRecognition-content");
    if(textRecognitionContent != null) {
        query.where("textRecognition.content").regex(new RegExp(`${textRecognitionContent}`));
    }

    // createdAt range
    const createdAtFrom = req.header("option-where-created-from");
    const createdAtTo = req.header("option-where-created-to");
    if(createdAtFrom != null && createdAtTo != null) {
        query.where("createdAt").gte(new Date(2018,5,20)).lte(new Date(2018,10,20));
    }

    // updatedAt range
    const updatedAtFrom = req.header("option-where-updated-from");
    const updatedAtTo = req.header("option-where-updated-to");
    if(updatedAtFrom != null && updatedAtTo != null) {
        query.where("updatedAt").gte(new Date(updatedAtFrom)).lte(new Date(updatedAtTo));
    }

    // tags
    const tags = req.header("option-where-tags");
    if(tags != null) {
        let parsedTags: Array<string>;
        try {
            parsedTags = JSON.parse(tags);
            let objectIds = parsedTags.map((entry) => {
                return mongoose.Types.ObjectId(entry);
            });

            // @ts-ignore: Bug in mongoose (https://github.com/Automattic/mongoose/issues/7612)
            query.where("tags_R").all(objectIds);
        } catch (error) {
            console.log("searchDocuments: error while parsing/searching tags: " + error);
        }
    }

    let result = await query.exec();
    console.log("done with query--------------------------------------------------- ");
    console.log("query=" + JSON.stringify(query.getQuery()));
    console.log("queryOptions=" + JSON.stringify(query.getOptions()));
    console.log("################################################################");
    console.log("result=" + JSON.stringify(result));

    res.status(200).send(result);
}