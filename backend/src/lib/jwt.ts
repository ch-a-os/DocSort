import * as mongoose from "mongoose";
import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { config } from '../config';
import { IUser } from "../models/user/user.interface";
import { User } from "../models/user/user.model";

export interface CustomRequest extends Request {
    userID?: mongoose.Types.ObjectId;
    user?: IUser
}

/**
 * We are injecting the users ID and database reference into the request for later use.
 */
export async function convert(req: CustomRequest, res: Response, next: Function): Promise<boolean | void> {
    return new Promise<boolean | void>(async (resolve, reject) => {
        try {
            const decoded = jwt.decode(req.header("token"), {complete: true, json: true});
            const id = mongoose.Types.ObjectId(decoded['payload'].id);
            const dbRef: IUser = await User.findById(id).select('username _id').exec();
            req.userID = id;
            req.user = dbRef;
            next();
            resolve();
        } catch(err) {
            reject(err);
        }        
    })
}

/**
 * Acts as Express middleware and tries to verify a jwt key given by the user.
 */
export function validateJWT(req: Request, res: Response, next: Function): boolean | void {
    let token = "";

    if(req.headers.token == null && req.query.token == null) {
        res.status(401).send({error: "Sorry, but you forgot to give me your token."});
        return false;
    }
    token = req.headers.token != null? req.headers.token : req.query.token;
    
    try {
        jwt.verify(token, config.secretJWT);
        next();
    } catch(err) {
        if(err) console.error(err);
        res.status(401).send({error: "Sorry, but that token you gave me is not vaild."})
    }
}