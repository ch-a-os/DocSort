import { ITag } from "../models/tag/tag.interface";
import { Tag } from "../models/tag/tag.model";
import { IUser } from "../models/user/user.interface";
import { User } from "../models/user/user.model";
import { CustomRequest } from "../lib/jwt";
export default async function createTag(req: CustomRequest, res: any) {
    const userTag: ITag = req.body;
    const user: IUser = await User.findById(req.userID).populate('tags_R').exec();

    // Check If body exist
    if(req.body == null) {
        res.status(400).send();
        return;
    }

    // Check If user was found
    if(user == null) {
        res.status(401).send();
        return;
    }

    if(await Tag.findOne({name: userTag.name}) != null) {
        // Tag already exist, call /updateTag instead
        res.status(409).send();
        return;
    }

    // Create tag If not exist
    const newTag = await Tag.create(userTag);

    // Give user that tag
    user.tags_R.push(newTag);
    await user.save();

    // Response with new tag ID
    res.status(200).send(newTag);
}