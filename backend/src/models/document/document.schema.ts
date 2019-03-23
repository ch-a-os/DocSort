import * as mongoose from "mongoose";
import { IDocument } from "./document.interface";
import { Document } from "./document.model";

export let Schema_DocumentTextRecognition: mongoose.Schema = new mongoose.Schema({
    enabled: { type: Boolean, required: false },
    finished: { type: Boolean, required: false },
    content: { type: String, required: false }
}, {
    _id: false
});

export let Schema_DocumentNumber: mongoose.Schema = new mongoose.Schema({
    primary: { type: Number, required: true },
    secondary: { type: Number, required: false }
}, {
    _id: false
});

export let Schema_Document: mongoose.Schema = new mongoose.Schema({
    index: { type: Number, required: false },
    number: { type: Schema_DocumentNumber, required: false },
    title: { type: String, required: false },
    note: { type: String, required: false },
    fileExtension: { type: String, required: false },

    user_R: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    tags_R: [{ type: mongoose.Schema.Types.ObjectId, required: false, ref: "Tag" }],

    mimeType: { type: String, required: false },
    textRecognition: { type: Schema_DocumentTextRecognition, required: false },
}, {
    timestamps: true
});

Schema_Document.pre("save", async function(this, next) {
    (this as IDocument).index = await Document.count({});
})