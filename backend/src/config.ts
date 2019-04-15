import { asyncReadFile } from './lib/fileUtil'
import { resolve } from 'path';

export interface IConfig {
    secretJWT: string;
    serverPort: number;
    mongodb: {
        url: string;
        eraseOnStartup: boolean
    };
}

export let config: IConfig = {
    secretJWT: "abc123",
    serverPort: 9090,
    mongodb: {
        url: "mongodb://localhost:27017/DocSort",
        eraseOnStartup: true
    }
}

export async function readConfig() {
    let userConfig: IConfig = config;
    try {
        userConfig = JSON.parse(await asyncReadFile(resolve('./config.json')));
    } catch(err) {
        console.error("A error occured while reading and parsing the config.json:\n\t", err);
        process.exit(1);
    }

    console.log(userConfig)

    // Check serverPort
    if(userConfig.serverPort == undefined) {

    }
    if(userConfig.serverPort <= 0) {
        console.warn("Value `serverPort` is less or equal to 0 and this is invalid! Using default: " + config.serverPort)
    } else {
        config.serverPort = userConfig.serverPort; 
    }

    config.secretJWT = config.secretJWT;
    config.mongodb.url = userConfig.mongodb.url;
    config.mongodb.eraseOnStartup = userConfig.mongodb.eraseOnStartup;
}