import * as mongoose from "mongoose";

interface IStyle {
    colorBackground?: string;
    colorForeground?: string;
    logo?: string;
}

export interface ITag extends mongoose.Document {
    // id
    name: string;
    style: IStyle;
}