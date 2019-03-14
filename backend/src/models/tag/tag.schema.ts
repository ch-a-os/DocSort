import * as mongoose from "mongoose";

let Schema_Style: mongoose.Schema = new mongoose.Schema({
    colorBackground: { type: String, required: false, default: "#000000" },
    colorForeground: { type: String, required: false, default: "#ffffff" },
    logo: { type: String, required: false }
});

export let Schema_Tag: mongoose.Schema = new mongoose.Schema({
    // id

    name: { type: String, required: true },
    style: { type: Schema_Style, required: false }
});