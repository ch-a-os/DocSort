import data from '../config.json';

export interface IConfig {
    secretJWT: string;
    serverPort: number;
    mongodb: {
        url: string;
        eraseOnStartup: boolean
    };
}

export const config: IConfig = data;