import { Request, Response } from "express";
import { User } from "../entity/user";
import { getUserIDFromJWT } from "../libs/getUserIDFromJWT";
import { getManager } from "typeorm";
import { Document } from "../entity/document";

export default async function searchDocuments(req: Request, res: Response) {
    try {
        const userId = getUserIDFromJWT(req.headers.token.toString());
        const user = await User.findOne({ where: { id: userId }});
        if(user == null) {
            console.log(`User with ID ${userId} does not exist in the database`);
            res.status(500).send();
            return;
        }

        let documentQueryBuilder = getManager().createQueryBuilder(Document, "document")
        documentQueryBuilder.where("document.userId = :userId", { userId: userId });
        createQueryBuilder(documentQueryBuilder, req);
        let documents = await documentQueryBuilder.getMany();
        
        res.status(200).send({
            documents: documents
        });
        console.log(`searchDocuments: returning ${documents.length} documents`);
        return true;
    } catch(err) {
        console.error(err);
        res.status(500).send({error: "Please see console output for error message."})
    }
}

function createQueryBuilder(documentQueryBuilder, req: Request) {

    const take = parseInt(req.header("option-take"), 10);

    if(isNaN(take) == false) {
        documentQueryBuilder.take(take);
    } else {
        documentQueryBuilder.take(10);
    }

    const order = req.header("option-order-order"); // TODO: Maybe find better name. Sounds weird.
    const field = req.header("option-order-field");
    if(field != null && order != null && (order == "ASC" || order == "DESC")) {
        documentQueryBuilder.orderBy(field, order);
    } else {
        documentQueryBuilder.orderBy("createdAt", "DESC");
    }

    const primaryNumber = parseInt(req.header("option-where-primarynumber"));
    if(isNaN(primaryNumber) == false) {
        documentQueryBuilder.andWhere("document.primaryNumber = :primaryNumber", { primaryNumber: primaryNumber });
    }

    const secondaryNumber = parseInt(req.header("option-where-secondarynumber"));
    if(isNaN(primaryNumber) == false) {
        documentQueryBuilder.andWhere("document.secondaryNumber = :secondaryNumber", { secondaryNumber: secondaryNumber });
    }

    const fileExtension = req.header("option-where-fileextension");
    if(fileExtension != null) {
        documentQueryBuilder.andWhere("document.fileExtension = :fileExtension", { fileExtension: fileExtension });
    }

    const title = req.header("option-where-title");
    if(title != null) {
        documentQueryBuilder.andWhere("document.title LIKE :title", { title: `%${title}%` });
    }

    const note = req.header("option-where-note");
    if(note != null) {
        documentQueryBuilder.andWhere("document.note LIKE :note", { note: `%${note}%` });
    }

    const mimeType = req.header("option-where-mimetype");
    if(mimeType != null) {
        documentQueryBuilder.andWhere("document.mimeType LIKE :mimeType", { mimeType: `%${mimeType}%` });
    }

    const ocrEnabled = req.header("option-where-ocrenabled");
    if(ocrEnabled != null && (ocrEnabled == "true" || ocrEnabled == "false")) {
        let value: boolean;
        if(ocrEnabled == "true") {
            value = true;
        } else if(ocrEnabled == "false") {
            value = false;
        }
        documentQueryBuilder.andWhere("document.ocrEnabled = :ocrEnabled", { ocrEnabled: value });
    }

    const ocrFinished = req.header("option-where-ocrfinished");
    if(ocrFinished != null && (ocrFinished == "true" || ocrFinished == "false")) {
        let value: boolean;
        if(ocrFinished == "true") {
            value = true;
        } else if(ocrFinished == "false") {
            value = false;
        }
        documentQueryBuilder.andWhere("document.ocrFinished = :ocrFinished", { ocrFinished: value });
    }

    const ocrText = req.header("option-where-ocrtext");
    if(ocrText != null) {
        documentQueryBuilder.andWhere("document.ocrText LIKE :ocrText", { ocrText: `%${ocrText}%` });
    }

    const createdAtFrom = req.header("option-where-created-from");
    const createdAtTo = req.header("option-where-created-to");
    if(createdAtFrom != null && createdAtTo != null) {
        documentQueryBuilder.andWhere("document.createdAt BETWEEN :from AND :to", { from: createdAtFrom, to: createdAtTo });
    }

    const updatedAtFrom = req.header("option-where-updated-from");
    const updatedAtTo = req.header("option-where-updated-to");
    if(updatedAtFrom != null && updatedAtTo != null) {
        documentQueryBuilder.andWhere("document.updatedAt BETWEEN :from AND :to", { from: updatedAtFrom, to: updatedAtTo });
    }
}