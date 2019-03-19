import { IUser } from "../models/user/user.interface";
import { User } from "../models/user/user.model";
import { getUserIDFromJWT } from "../lib/getUserIDFromJWT";
import { Tag } from "../models/tag/tag.model";
import * as mongoose from 'mongoose';
import { ITag } from "../models/tag/tag.interface";

export default async function updateTag(req, res) {
    const user: IUser = await User.findById(getUserIDFromJWT(req.headers.token)).populate('tags_R').exec();
    const changedTag: ITag = req.body;
    
    // Check If body exist
    if(changedTag == null) {
        res.status(400).send();
        return;
    }

    // Check If user was found
    if(user == null) {
        res.status(401).send();
        return;
    }

    await Tag.update({_id: changedTag._id}, changedTag).exec();

    res.status(200).send();
}