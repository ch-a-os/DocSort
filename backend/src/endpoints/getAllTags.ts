import * as mongoose from 'mongoose';
import { IUser } from "../models/user/user.interface";
import { User } from "../models/user/user.model";
import { ModifiedRequest } from "../lib/jwt";
import { Document } from "../models/document/document.model";
import { ITag } from '../models/tag/tag.interface';

export default async function getAllTags(req: ModifiedRequest, res: any) {
    // Get all tags for the user
    const user: IUser = await User.findById(req.userID).populate('tags_R').exec();
    let newTagObj: Array<TagCount> = new Array<TagCount>();

    // Get the document-count for that tag
    for(let i = 0; i < user.tags_R.length; i++) {
        const currentTag = user.tags_R[i] as ITag;
        const docCount: number = await Document.countDocuments({
            tags_R: {
                $elemMatch: {$eq: mongoose.Types.ObjectId(currentTag._id)
                }
            },
            user_R: {
                $eq: mongoose.Types.ObjectId(user._id)
            }
        });
        const tagCount: TagCount = new TagCount(currentTag, docCount);
        newTagObj.push(tagCount);
    }
    console.log("Found:", newTagObj)
    res.status(200).send(newTagObj);
}

class TagCount {
    _id: mongoose.Types.ObjectId;
    name: string;
    count: number;  // This class because of that extra value :D
    style: {
        colorBackground?: string;
        colorForeground?: string;
        logo?: string;
    };

    constructor(tag: ITag, count: number) {
        this._id = tag._id;
        this.name = tag.name;
        this.count = count;
        this.style = tag.style;
    }
}