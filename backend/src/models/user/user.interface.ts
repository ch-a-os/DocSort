import * as mongoose from "mongoose";
import { ITag } from "../tag/tag.interface";

export interface IUser extends mongoose.Document {
    username: string;
    password: string;
    salt: string;
    tags_R: Array<ITag|mongoose.Types.ObjectId>;
    nextPrimaryNumber: number;

    createdAt: Date;
    updatedAt: Date;
}