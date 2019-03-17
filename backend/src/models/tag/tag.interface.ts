import * as mongoose from "mongoose";

export interface ITag extends mongoose.Document {
    name: string;
    style: {
        colorBackground?: string;
        colorForeground?: string;
        logo?: string;
    };
}