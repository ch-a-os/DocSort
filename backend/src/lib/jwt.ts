import * as mongoose from "mongoose";
import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { IUser } from "../models/user/user.interface";
import { User } from "../models/user/user.model";
import { configManager } from "../app";
import { log } from "./logging";

export interface ModifiedRequest extends Request {
    userID?: mongoose.Types.ObjectId;
    user?: IUser
}

/**
 * Extracts the user ID out of the JWT
 * @param jsonwebtoken JWT of user
 * @returns ObjectID of user
 */
export async function addUserToRequest(req: ModifiedRequest, res: Response, next: Function): Promise<void> {
    try {
        const decoded = jwt.decode(req.header("token"), {complete: true, json: true});
        const id = mongoose.Types.ObjectId(decoded['payload'].id);
        const dbRef: IUser = await User.findById(id).select('username _id').exec();

        if(dbRef == null || dbRef == undefined) {
            res.status(401).send();
            log.error("User does not longer exist in database!");
            return;
            //throw new Error("User does not longer exist in database!");
        }

        req.userID = id;
        req.user = dbRef;
        next();
    } catch (error) {
        throw new Error(error);
    }
}

/**
 * Acts as Express middleware and tries to verify a jwt key given by the user.
 */
export function validateJWT(req: Request, res: Response, next: Function): boolean | void {
    let token = "";

    if(req.headers.token == null && req.query.token == null) {
        res.status(401).send({error: "No token in request"});
        return false;
    }
    token = req.headers.token != null? req.headers.token : req.query.token;
    
    try {
        jwt.verify(token, configManager.config.secretJWT);
        next();
    } catch(err) {
        if(err) {
            log.error(JSON.stringify(err));
        }
        res.status(401).send({error: "Invalid token in request."})
    }
}