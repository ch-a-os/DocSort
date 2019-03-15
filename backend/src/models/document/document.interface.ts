import * as mongoose from "mongoose";
import { IUser } from "../user/user.interface";
import { ITag } from "../tag/tag.interface";

interface ITextRecognition {
    enabled?: boolean;
    finished?: boolean;
    content?: string;
}

interface INumber {
    primary?: number;
    secondary?: number;
}

export interface IDocument extends mongoose.Document {
    //_id: mongoose.Schema.Types.ObjectId;
    number: INumber;
    title?: string;
    note?: string;
    fileExtension?: string;

    user_R?: IUser;
    tags_R?: Array<ITag>;

    mimeType?: string;
    textRecognition?: ITextRecognition;

    createdAt?: Date;   // Durch Timestamps = true
    updatedAt?: Date;   // Durch Timestamps = true
}
