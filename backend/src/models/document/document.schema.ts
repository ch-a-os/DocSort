import * as mongoose from "mongoose";

let Schema_TextRecognition: mongoose.Schema = new mongoose.Schema({
    enabled: { type: Boolean, required: false },
    finished: { type: Boolean, required: false },
    content: { type: String, required: false }
});

let Schema_Number: mongoose.Schema = new mongoose.Schema({
    primary: { type: Number, required: true },
    secondary: { type: Number, required: false }
});

export let Schema_Document: mongoose.Schema = new mongoose.Schema({
    //_id

    number: { type: Schema_Number, required: false },
    title: { type: String, required: false },
    note: { type: String, required: false },
    fileExtension: { type: String, required: false },

    user_R: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    tags_R: [{ type: mongoose.Schema.Types.ObjectId, required: false, ref: "Tag" }],

    mimeType: { type: String, required: false },
    textRecognition: { type: Schema_TextRecognition, required: false },
}, {
    timestamps: true
});