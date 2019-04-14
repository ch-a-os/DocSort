import mongoose from "mongoose";
import { IUser } from "./user.interface";
import { createPasswordHash } from "../../lib/security";
import { createRandomString } from "../../lib/stringUtil";

let Schema_User: mongoose.Schema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: false },
    tags_R: [{ type: mongoose.Schema.Types.ObjectId, required: false, ref: "Tag" }],
    nextPrimaryNumber: { type: Number, required: false, default: 0 }
}, {
    timestamps: true
});

Schema_User.pre("save", async function(this, next) {
    const salt: string = createRandomString(16);
    const hashedPW: string = await createPasswordHash((this as IUser).password, salt);
    (this as IUser).password = hashedPW;
    (this as IUser).salt = salt;
    next();
});

export { Schema_User };