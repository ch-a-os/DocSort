import * as mongoose from "mongoose";

interface IStyle {
    colorBackground?: string;
    colorForeground?: string;
    logo?: string;
}

export interface ITag extends mongoose.Document {
    name: string;
    style: IStyle;
}