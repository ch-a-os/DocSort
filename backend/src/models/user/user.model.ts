import * as mongoose from "mongoose";
import { Schema_User } from "./user.schema";
import { IUser } from "./user.interface";

export const User: mongoose.Model<IUser> = mongoose.model<IUser>("User", Schema_User, "User");