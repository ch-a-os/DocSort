import { resolve } from 'path';
import { readFile } from 'fs';

/**
 * Small promise wrapper for the readFile(...) function
 */
export async function asyncReadFile(path: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        readFile(path, 'utf8', (err, data) => {
            if(err) reject(err)
            resolve(data)
        })
    })
}