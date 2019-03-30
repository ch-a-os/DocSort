import * as crypto from 'crypto';

/**
 * This function creates a hash of a given password and salt.
 * @param password Password to hash
 * @param salt String that get's appended at password
 */
export async function createPasswordHash(password: string, salt: string): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        const hashRounds = 1;
        let computedHash = password;    // Not a hash on first run but a start value

        // Start hash rounds
        for(let x = 0; x < hashRounds; x++) {
            try {
                computedHash = await scrypt(computedHash, salt);
            } catch(err) {
                reject(err);
            }
        }
        resolve(computedHash);
    })
}

/**
 * Small wrapper to make async crypto.scrypt function to an promise.
 */
function scrypt(hash, salt): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        crypto.scrypt(hash, salt, 64, (err, key) => {
            if(err) reject(err);
            resolve(key.toString("base64"));
        })
    })
}

/**
 * Takes an document and returns it's encrypted buffer.
 * @param document Binary document file to encrypt
 * @param password Password to encrypt file
 * @param iv Random iv which is stored in the database
 * @returns Encrypted document in form of an Buffer.
 */
export function encryptDocument(document: Buffer, password: string, iv: string): Buffer {
    let key = crypto.createHash('sha256').update(password).digest('hex').substr(0, 32);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    const crypted = Buffer.concat([cipher.update(document), cipher.final()]);
    return crypted;
}

/**
 * Takes an document and returns it's decrypted buffer.
 * @param document Binary document file to decrypt
 * @param password Password which was used on encryption
 * @param iv Random iv which is stored in the database
 * @returns Decrypted document in form of an Buffer.
 */
export function decryptDocument(document: Buffer, password: string, iv: string): Buffer {
    let key = crypto.createHash('sha256').update(password).digest('hex').substr(0, 32);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    const decrypted = Buffer.concat([decipher.update(document), decipher.final()]);
    return decrypted;
}