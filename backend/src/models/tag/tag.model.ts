import * as mongoose from "mongoose";
import { ITag } from "./tag.interface";
import { Schema_Tag } from "./tag.schema";

export const Tag: mongoose.Model<ITag> = mongoose.model<ITag>("Tag", Schema_Tag, "Tag");