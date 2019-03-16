import * as mongoose from "mongoose";
import * as jwt from 'jsonwebtoken';

export function getUserIDFromJWT(jsonwebtoken: string): mongoose.Types.ObjectId {
    const decoded = jwt.decode(jsonwebtoken, {complete: true, json: true});
    const id = mongoose.Types.ObjectId(decoded['payload'].id);
    return id;
}