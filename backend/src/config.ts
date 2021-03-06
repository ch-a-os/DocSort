import { asyncReadFile, asyncExist, asyncWriteFile } from './lib/fileUtil'
import { resolve } from 'path';
import { createRandomString } from './lib/stringUtil';
import { log } from './lib/logging';

export interface IConfig {
    secretJWT: string;
    serverPort: number;
    mongodb: {
        url: string;
        eraseOnStartup: boolean
    };
}

export class Config {
    config: IConfig = {
        secretJWT: createRandomString(32),
        serverPort: 9090,
        mongodb: {
            url: "mongodb://localhost:27017/DocSort",
            eraseOnStartup: true
        }
    }

    constructor(defaultConfig: IConfig) {
        if(defaultConfig != null) this.config = defaultConfig;
    }

    async readConfig() {
        const configLocation: string = resolve('./config.json');
        let userConfig: IConfig = this.config;
        try {
            userConfig = <IConfig>JSON.parse(await asyncReadFile(configLocation));
        } catch(err) {
            if(!await asyncExist(configLocation)) {
                log.warn("No config-file found");
                await asyncWriteFile(configLocation, JSON.stringify(this.config, null, 4))
                log.info("Config-File created");
            } else {
                log.error("A error occured while reading and parsing the config.json:\n\t" + JSON.stringify(err));
                process.exit(1);
            }
        }
        this.validateConfigAndSet(userConfig)
    }

    async validateConfigAndSet(userConfig) {
        // Check serverPort
        if(userConfig.serverPort == undefined) {
            log.warn(`Value \`serverPort\` is undefined! Using default: ${this.config.serverPort}`)
        } else if(typeof(userConfig.serverPort) != "number") {
            log.warn(`Value \`serverPort\` is not a number! Using default ${this.config.serverPort}`)
        } else if (userConfig.serverPort <= 0) {
            log.warn(`Value \`serverPort\` is less or equal to 0 and this is invalid! Using default: ${this.config.serverPort}`)
        } else {
            this.config.serverPort = userConfig.serverPort; 
        }
    
        // Check secretJWT
        if(userConfig.secretJWT == undefined) {
            log.warn(`Value \`secretJWT\` is undefined! Using default: ${this.config.secretJWT.substr(0, 8)}...`)
        } else if(typeof(userConfig.secretJWT) != "string") {
            log.warn(`Value \`secretJWT\` is not a string! Using default: ${this.config.secretJWT.substr(0, 8)}...`)
        } else if (userConfig.secretJWT.length < 16) {
            log.warn(`**SECURITY ISSUE** Value \`secretJWT\` is less then 16 characters long! We recommend to use a key that has length of 16 at minimum.`)
            this.config.serverPort = userConfig.serverPort; 
        } else {
            this.config.serverPort = userConfig.serverPort; 
        }
    
        // Check mongodb.url
        if(userConfig.mongodb.url == undefined) {
            log.warn(`Value \`mongodb.url\` is undefined! Using default: ${this.config.mongodb.url}`)
        } else if(typeof(userConfig.mongodb.url) != "string") {
            log.warn(`Value \`mongodb.url\` is not a string! Using default: ${this.config.mongodb.url}`)
        } else if (!userConfig.mongodb.url.startsWith("mongodb://")) {
            log.warn(`Value \`mongodb.url\` has a invaild protocol. It has to start with "mongodb://". Using default: ${this.config.mongodb}`)
        } else {
            this.config.serverPort = userConfig.serverPort; 
        }

        // Check mongodb.eraseOnStartup
        if(userConfig.mongodb.eraseOnStartup == undefined) {
            log.warn(`Value \`mongodb.url\` is undefined! Using default: ${this.config.mongodb.eraseOnStartup}`)
        } else if(typeof(userConfig.mongodb.eraseOnStartup) != "boolean") {
            log.warn(`Value \`mongodb.url\` is not a boolean! Using default: ${this.config.mongodb.eraseOnStartup}`)
        } else {
            this.config.serverPort = userConfig.serverPort; 
        }
    }
}