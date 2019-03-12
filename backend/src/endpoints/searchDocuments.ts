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
    where: OptionWhere;

    constructor(req: Request) {
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
        this.order = new OptionOrder(req);
        this.where = new OptionWhere(req);
    }
}

class OptionOrder {
    field: string;
    order: string;

    constructor(req: Request) {
        const order = req.header("option-order-order");
        const field = req.header("option-order-field");
        if(field == null || order == null) {
            this.setDefaults();
            return;
        }
        if(order != "asc" && order != "desc") {
            this.setDefaults();
            return;
        }
        this.field = field;
        this.order = order;
    }

    setDefaults() {
        this.field = "createdAt";
        this.order = "desc";
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
        this.parseRequest(req);
        this.removeEmptyObjects();
    }

    parseRequest(req: Request) {
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
            this.fileExtension = req.header("option-where-fileExtension");
        }

        if(req.header("option-where-title") != undefined) {
            this.title = req.header("option-where-title");
        }

        if(req.header("option-where-note") != undefined) {
            this.note = req.header("option-where-note");
        }

        if(req.header("option-where-mimeType") != undefined) {
            this.mimeType = req.header("option-where-mimeType");
        }

        if(req.header("option-where-ocrEnabled") != undefined) {
            const _ocrEnabled = req.header("option-where-ocrEnabled");
            if(_ocrEnabled == "true") {
                this.ocrEnabled = true;
            } else if(_ocrEnabled == "false") {
                this.ocrEnabled = false;
            }
        }

        if(req.header("option-where-ocrText") != undefined) {
            this.ocrText = req.header("option-where-ocrText");
        }
    }

    removeEmptyObjects() {
        for (const key in this) {
            if(this[key] == null) {
                delete this[key];
            }
        }
    }
}