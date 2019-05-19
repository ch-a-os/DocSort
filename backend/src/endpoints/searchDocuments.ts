import { Request, Response } from "express";
import { User } from "../models/user/user.model";
import { Document } from "../models/document/document.model";
import * as mongoose from "mongoose";
import { ModifiedRequest } from "../lib/jwt";
import { log } from "../lib/logging";
import { ApplicationError } from "../lib/applicationError";

export default async function searchDocuments(req: ModifiedRequest, res: Response) {
    /**
     * A list of possible search querys:
     *  - option-order-order
     *  - option-order-field
     *  - option-limit
     *  - option-where-number-primary
     *  - option-where-number-secondary
     *  - option-where-fileextension
     *  - option-where-title (default)
     *  - option-where-note
     *  - option-where-mimetype
     *  - option-where-textRecognition-enabled
     *  - option-where-textRecognition-finished
     *  - option-where-textRecognition-content
     *  - option-where-created-from
     *  - option-where-created-to
     *  - option-where-updated-from
     *  - option-where-updated-to
     *  - option-where-tags
     */
    try {
        const userId = req.userID;
        const user = await User.findOne({ _id: userId });
        if(user == null) {
            log.warn(`User with ID ${userId} does not exist in the database`);
            res.status(500).send();
            return;
        }
        let query = Document.where("user_R").equals(userId);

        // take
        const limit = parseInt(req.header("option-limit"), 10);
        if(isNaN(limit) == false) {
            query.limit(limit);
        } else {
            query.limit(50);
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
        let title = req.header("option-where-title");
        if(title != null) {
            title = title.replace(/([.+?=^!:${}()|[\]\/\\])/g, '\\$1');
            title = title.replace(/\*{2,}|\*/g, ".*");
            query.where("title").regex(new RegExp(`${title}`, 'i'));  // Ignoring upper and lower case
        }

        // note
        let note = req.header("option-where-note");
        if(note != null) {
            note = note.replace(/([.+?=^!:${}()|[\]\/\\])/g, '\\$1');
            note = note.replace(/\*{2,}|\*/g, ".*");
            query.where("note").regex(new RegExp(`${note}`, 'i'));  // Ignoring upper and lower case    
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
        const createdFrom = parseDateFromHeader(req, "option-where-created-from");
        const createdTo = parseDateFromHeader(req, "option-where-created-to");
        if(createdFrom != null && createdTo != null) {
            query.where("createdAt").gte(createdFrom).lte(createdTo);
        }

        // updatedAt range
        const updatedFrom = parseDateFromHeader(req, "option-where-updated-from");
        const updatedTo = parseDateFromHeader(req, "option-where-updated-to");
        if(updatedFrom != null && updatedTo != null) {
            query.where("updatedAt").gte(updatedFrom).lte(updatedTo);
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
                log.error("searchDocuments: error while parsing/searching tags: " + error);
            }
        }

        let result = await query.exec();
        
        // code-block for detailed query-debugging. Can be removed later
        /*console.log("done with query--------------------------------------------------- ");
        console.log("query=" + JSON.stringify(query.getQuery(), null, 4));
        console.log("queryOptions=" + JSON.stringify(query.getOptions(), null, 4));
        console.log("################################################################");
        console.log("result=" + JSON.stringify(result, null, 4));*/

        res.status(200).send(result);
    } catch(err) {
        throw new ApplicationError("error in searchDocuments");
    }
}

function parseDateFromHeader(req: Request, fieldName: string): Date|null {
    const headerValue = req.header(fieldName);
    if(headerValue == null) {
        return null;
    }
    const splittedDate = headerValue.split("-");

    let year = splittedDate[0];
    let month = splittedDate[1];
    let day = splittedDate[2];

    let yearInt = parseInt(year);
    if(month[0] == "0") {
        month = month[1];
    }
    let monthInt = parseInt(month)-1;
    let dayInt = parseInt(day);
    let date = new Date(yearInt, monthInt, dayInt);
    return date;
}