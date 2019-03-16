import * as mongoose from "mongoose";
import { User } from "../models/user/user.model";

export async function getNextPrimaryNumber(userId: mongoose.Schema.Types.ObjectId) {
    let { nextPrimaryNumber } = await User.findOneAndUpdate({ _id: userId }, { $inc : { nextPrimaryNumber: 1 }}, { new: true });
    return nextPrimaryNumber;
}