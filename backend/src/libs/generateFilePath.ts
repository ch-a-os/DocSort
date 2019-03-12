import { Document } from '../entity/document';
import * as path from 'path';

export function generateFilePath(document: Document) {
    const filePath = path.resolve(`./src/uploads/${document.uid}_${document.primaryNumber}.${document.secondaryNumber}.${document.fileExtension}`);
    return filePath;
}