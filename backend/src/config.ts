import data from '../config.json';

export interface IConfig {
    secretJWT: string;
    serverPort: number;
    mongodb: string;
}

export const config: IConfig = data;