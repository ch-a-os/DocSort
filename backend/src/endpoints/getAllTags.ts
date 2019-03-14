import { ITag } from "../models/tag/tag.interface";
import { Tag } from "../models/tag/tag.model";

export default async function getAllTags(req: any, res: any) {
    
    const tags: Array<ITag> = await Tag.find().sort({name: -1}).exec();
    console.log(`getAllTags: found ${tags.length} Tags`);
    res.status(200).send(tags);
}