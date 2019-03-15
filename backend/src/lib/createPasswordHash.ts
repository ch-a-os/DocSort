import * as crypto from 'crypto';

/**
 * This function creates a hash of a given password and salt.
 * This takes about 1.3sek to complete because of 35 hash iterations. 
 * @param password Password to hash
 * @param salt String that get's appended at password
 */
export async function createPasswordHash(password: string, salt: string): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        const hashRounds = 100;
        let computedHash = await scrypt(password, salt);    // First round
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