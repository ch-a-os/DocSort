import { IUser } from "../models/user/user.interface";
import { User } from "../models/user/user.model";
import { getUserIDFromJWT } from "../lib/getUserIDFromJWT";

export default async function getAllTags(req: any, res: any) {
    const user: IUser = await User.findById(getUserIDFromJWT(req.headers.token)).populate('tags_R').exec();
    console.log(`getAllTags: found ${user.tags_R} Tags`);
    res.status(200).send(user.tags_R);
}