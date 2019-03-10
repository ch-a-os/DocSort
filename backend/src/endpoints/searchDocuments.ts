import { Request, Response } from "express";
import { Document } from "../entity/document";
import { User } from "../entity/user";
import { getUserIDFromJWT } from "../libs/getUserIDFromJWT";

export default async function searchDocuments(req: Request, res: Response) {
    try {
        const userId = getUserIDFromJWT(req.headers.token.toString());
        const user = await User.findOne({ where: { id: userId }});
        if(user == null) {
            console.log(`User with ID ${userId} does not exist in the database`);
            res.status(500).send();
            return;
        }
        
        let optionLimit = parseInt(req.header("optionLimit"));
        let optionOrderField = req.header("optionOrderField");
        let optionOrder = req.header("optionOrder");

        if(optionLimit == null) {
            optionLimit = 5;
        }
        if(optionOrderField == null) {
            optionOrderField = "updatedAt";
        }
        if(optionOrder == null) {
            optionOrder = "DESC";
        }

        let queryOptions: any = {};
        queryOptions.order = {};
        queryOptions.where = new Array();
        queryOptions.where.push({ user: user });

        queryOptions.take = optionLimit;
        queryOptions.order[optionOrderField] = optionOrder;

        const documents = await Document.find(queryOptions);
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