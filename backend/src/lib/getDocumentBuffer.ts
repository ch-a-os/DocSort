import * as fs from "fs";
import { generateFilePath } from "./generateFilePath";
import { IDocument } from "../models/document/document.interface";

export async function getDocumentBuffer(doc: IDocument): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
        fs.readFile(generateFilePath(doc), (err, data) => {
            if(err) reject(err);
            resolve(data);
        })    
    })
}