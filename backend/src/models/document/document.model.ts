import * as mongoose from "mongoose";
import { Schema_Document } from "./document.schema";
import { IDocument } from "./document.interface";

export const Document: mongoose.Model<IDocument> = mongoose.model<IDocument>("Document", Schema_Document, "Document");