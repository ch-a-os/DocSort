export interface IConfig {
    secretJWT: string;
    serverPort: number;
    mongodb: string;
}

export const config: IConfig = {
    secretJWT: "superSecretLOL",
    serverPort: 9090,
    mongodb: "mongodb://localhost:27017/docSort"
}