import * as mongoose from "mongoose";
import { User } from "../models/user/user.model";

export async function getNewPrimaryNumber(userId: mongoose.Schema.Types.ObjectId) {
    let { lastPrimaryNumber } = await User.findOneAndUpdate({ id: userId }, { $inc : { lastPrimaryNumber: 1 }}, { new: false });
    console.log("lastPrimaryNumber = " + lastPrimaryNumber);
    return lastPrimaryNumber;
}