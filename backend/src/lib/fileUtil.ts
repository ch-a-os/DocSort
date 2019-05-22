import { readFile, exists, writeFile } from 'fs';

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

/**
 * Small promise wrapper for the exists(...) function
 */
export async function asyncExist(path: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        exists(path, (doesIt) => {
            resolve(doesIt)
        })
    })
}

/**
 * Small promise wrapper for the exists(...) function
 */
export async function asyncWriteFile(path: string, data: any): Promise<any> {
    return new Promise<boolean>((resolve, reject) => {
        writeFile(path, data, (err) => {
            if(err) reject(err)
            resolve()
        })
    })
}