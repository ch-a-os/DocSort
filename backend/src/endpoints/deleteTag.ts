import { IUser } from "../models/user/user.interface";
import { User } from "../models/user/user.model";
import { Tag } from "../models/tag/tag.model";
import { ModifiedRequest } from "../lib/jwt";
import { formatError, ApplicationError, ERROR } from "../lib/errorHandler";

export default async function deleteTag(req: ModifiedRequest, res) {
    try {
        const user: IUser = await User.findById(req.userID).populate('tags_R').exec();
        const toDelete: string = req.body.id;
        
        // Check If body exist
        if(toDelete == null) {
            res.status(400).send();
            return;
        }

        // Check If user was found
        if(user == null) {
            res.status(401).send();
            return;
        }

        await Tag.deleteOne({_id: toDelete}).exec();

        res.status(200).send();
    } catch(err) {
        if(res.headersSent) formatError(err);
        else {
            formatError(new ApplicationError(ERROR.UncaughtError, err.message, res));
        }
    }
}