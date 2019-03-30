import { IUser } from "../models/user/user.interface";
import { User } from "../models/user/user.model";
import { CustomRequest } from "../lib/jwt";

export default async function getAllTags(req: CustomRequest, res: any) {
    const user: IUser = await User.findById(req.userID).populate('tags_R').exec();
    console.log(`getAllTags: found ${user.tags_R} Tags`);
    res.status(200).send(user.tags_R);
}