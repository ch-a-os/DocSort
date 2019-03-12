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

class Options {
    take: Number;
    order: OptionOrder;
    where: any;

    constructor(req: Request) {
        this.where
        this.setDefaults();
        this.parseRequest(req);
    }

    setDefaults() {
        this.take = 10;
    }

    parseRequest(req: Request) {
        const parsedTake = parseInt(req.header("option-take"), 10);
        if(parsedTake != NaN) {
            this.take = parsedTake;
        }
        this.order = new OptionOrder(req.header("option-order"));
    }
}

class OptionOrder {
    field: string;
    order: string;

    constructor(order: any) {
        if(order == null) {
            this.setDefaults();
            return;
        }
        if(order.field == null || order.order == null) {
            this.setDefaults();
            return;
        }
        this.field = order.field;
        this.order = order.order;
    }

    setDefaults() {
        this.field = "createdAt";
        this.order = "DESC";
    }
}

class OptionWhere {
    primaryNumber: number;
    secondaryNumber: number;
    fileExtension: string;
    title: string;
    note: string;
    // tags: any;
    mimeType: string;
    ocrEnabled: boolean;
    ocrText: string;
    //createdAt: Date;
    //updatedAt: Date;

    constructor(req: Request) {
        if(req.header("option-where-primaryNumber") != undefined) {
            const _primaryNumber = parseInt(req.header("option-where-primaryNumber"));
            if(_primaryNumber != NaN) {
                this.primaryNumber = _primaryNumber;
            }
        }
        
        if(req.header("option-where-secondaryNumber") != undefined) {
            const _secondaryNumber = parseInt(req.header("option-where-secondaryNumber"));
            if(_secondaryNumber != NaN) {
                this.secondaryNumber = _secondaryNumber;
            }
        }

        if(req.header("option-where-fileExtension") != undefined) {

        }

        if(req.header("option-where-title") != undefined) {

        }

        if(req.header("option-where-note") != undefined) {

        }

        if(req.header("option-where-mimeType") != undefined) {

        }

        if(req.header("option-where-ocrEnabled") != undefined) {

        }

        if(req.header("option-where-ocrText") != undefined) {

        }
    }

}