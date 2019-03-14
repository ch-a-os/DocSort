import * as crypto from 'crypto';

export function createPasswordHash(password: string, salt: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        let computedHash: string = "";
        const hashRounds = 2;
        crypto.scrypt(password, salt, 64, (err, key) => {
            if(err) reject(err);
            computedHash = key.toString('base64');
            for(let x = 0; x < hashRounds; x++) {
                try {
                    computedHash = crypto.scryptSync(computedHash, salt, 64).toString('base64');
                } catch(err) {
                    reject(err);
                }
            }
            console.log("createPasswordHash:" + password + " -> " + salt + " -> " + computedHash);
            resolve(computedHash);
        })
    })
}