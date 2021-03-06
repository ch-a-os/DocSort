import * as mongoose from "mongoose";
import { User } from "../models/user/user.model";

/**
 * Calculates new primary number and updates it in the database.
 */
export async function getNextPrimaryNumber(userId: mongoose.Types.ObjectId) {
    let { nextPrimaryNumber } = await User.findOneAndUpdate({ _id: userId }, { $inc : { nextPrimaryNumber: 1 }}, { new: true });
    return nextPrimaryNumber;
}