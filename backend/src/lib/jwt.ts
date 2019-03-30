import * as mongoose from "mongoose";
import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { config } from '../config';

/**
 * Extracts the user ID out of the JWT
 * @param jsonwebtoken JWT of user
 * @returns ObjectID of user
 */
export function getUserIDFromJWT(jsonwebtoken: string): mongoose.Types.ObjectId {
    const decoded = jwt.decode(jsonwebtoken, {complete: true, json: true});
    const id = mongoose.Types.ObjectId(decoded['payload'].id);
    return id;
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