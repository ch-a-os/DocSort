import * as mongoose from "mongoose";
import * as jwt from 'jsonwebtoken';

export function getUserIDFromJWT(jsonwebtoken: string): mongoose.Schema.Types.ObjectId {
    const decoded = jwt.decode(jsonwebtoken, {complete: true, json: true});
    return decoded['payload'].id;
}