import * as mongoose from "mongoose";
import { IUser } from "../user/user.interface";
import { ITag } from "../tag/tag.interface";

export interface IDocument extends mongoose.Document {
    number: {
        primary?: number;
        secondary?: number;
    };
    title?: string;
    note?: string;
    fileExtension?: string;

    user_R?: IUser|mongoose.Types.ObjectId;
    tags_R?: Array<ITag|mongoose.Types.ObjectId>;

    mimeType?: string;
    textRecognition?: {
        enabled?: boolean;
        finished?: boolean;
        content?: string;
    }

    marked: Boolean;

    createdAt?: Date;   // Durch Timestamps = true
    updatedAt?: Date;   // Durch Timestamps = true
}