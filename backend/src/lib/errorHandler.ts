import { log } from './logging';
import chalk from 'chalk';
import { Response } from 'express';

export enum ERROR {
    NotFoundError = 404,
    AuthenticationError = 401,
    UnknownError = 500
}

export class ApplicationError extends Error {
    status: number;
    response: Response;
    constructor(name: ERROR, message?: string, response?: Response) {
        super();

        this.name = ERROR[name] || ERROR[ERROR.UnknownError];
        console.log(this.constructor.name);
        this.message = message || 'Something went wrong but we can\'t tell what. Please try again.';
        this.status = name;
        this.response = response;

        Error.captureStackTrace(this);

        console.log("Test=", this.status);
        if(this.response != undefined && !this.response.headersSent) {
            this.response.status(this.status);
            this.response.send({
                name: this.name,
                message: this.message
            });
        }
    }
}

export async function formatError(err: Error) {
    console.log("")
    log.error(`${chalk.redBright("================= [ ERROR ] =================")}`)
    log.error(`${chalk.bold("Something unexpected happend (╯°□°）╯︵ ┻━┻")}`)
    log.error(`${chalk.bold("Please report the following error by creating an issue on GitHub:")}`)
    log.error(`${err.stack}`)
    log.error(`${chalk.bold("Please following our guide on how to create a helpful bug report here: COMING SOON")}`)
    log.error(`${chalk.redBright("================== [ END ] ==================")}`)
    console.log("")
}