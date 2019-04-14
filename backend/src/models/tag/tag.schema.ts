import mongoose from "mongoose";

export let Schema_TagStyle: mongoose.Schema = new mongoose.Schema({
    colorBackground: { type: String, required: false, default: "#000000" },
    colorForeground: { type: String, required: false, default: "#ffffff" },
    logo: { type: String, required: false }
}, {
    _id: false
});

export let Schema_Tag: mongoose.Schema = new mongoose.Schema({
    // id

    name: { type: String, required: true },
    style: { type: Schema_TagStyle, required: false, default: {}}
});