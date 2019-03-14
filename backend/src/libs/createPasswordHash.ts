import * as crypto from 'crypto';

/**
 * This function creates a hash of a given password and salt.
 * This takes about 1.3sek to complete because of 35 hash iterations. 
 * @param password Password to hash
 * @param salt String that get's appended at password
 */
export function createPasswordHash(password: string, salt: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        let computedHash: string = "";
        const hashRounds = 2;
        crypto.scrypt(password, salt, 64, (err, key) => {
            if(err) reject(err);
            computedHash = key.toString('base64');
            for(let x = 0; x < hashRounds; x++) {
                try {
                    crypto.scrypt(computedHash, salt, 64, (err, key) => {
                        computedHash = key.toString('base64')
                    });
                } catch(err) {
                    reject(err);
                }
            }
            resolve(computedHash);
        })
    })
}