import { Request, Response } from "express";
import { getUserIDFromJWT } from "../libs/getUserIDFromJWT";
import { User } from "../entity/user";
import { getConnection } from "typeorm";
import { getDocumentBuffer } from "../libs/getDocument";
import { Document } from "../entity/document";

export default async function getDocuments(req: Request, res: Response) {
    const docID: number = req.params.docID;
    const file: boolean = req.query.file;
    const limit: number = req.query.limit;
    const order: number = req.query.order;  // 0 means latest, 1 means oldest
    const user: User = await User.findOne({where: {id: getUserIDFromJWT(<any> req.headers.token || req.query.token)}});

    // Return all files
    const orderingType = order == 0 ? 'DESC' : 'ASC';
    const documents = await getConnection()
        .getRepository(Document)
        .createQueryBuilder("document")
        .where(`document.userId = ${user.id}`)
        .orderBy(`document.createdAt`, orderingType)
        .take(limit)
        .getMany();
    res.status(200).send(documents);
}