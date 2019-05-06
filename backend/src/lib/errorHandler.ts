import { log } from './logging';
import chalk from 'chalk';
import { Response } from 'express';

export enum ERROR {
    NotFoundError = 404,
    AuthenticationError = 401,
    UncaughtError = 500
}

export class ApplicationError extends Error {
    errors: any = {
        NotFoundError: {
            crititcal: false,
            default: 'A requested resource couldn\'t be found.'
        },
        AuthenticationError: {
            crititcal: false,
            default: 'A authentification of a user went wrong.'
        },
        UncaughtError: {
            crititcal: true,
            default: null
        }
    }
    status: number;
    response: Response;

    /**
     * This class will or will not throw an error based on the priority.
     * It will respond to the client with all necessary information. 
     * @param type Type of the error
     * @param message Custon message of error
     * @param response Express response to respond to the client
     */
    constructor(type: ERROR, message?: string, response?: Response) {
        super();
        const errorName = ERROR[type];

        this.name = errorName || ERROR[ERROR.UncaughtError];
        this.message = message || this.errors[errorName].default || this.message;
        this.status = type;
        this.response = response;

        // Decide to throw error or just print a small line
        if(this.errors[ERROR[type]].crititcal) {
            Error.captureStackTrace(this);
            if(this.response != undefined && !this.response.headersSent) {
                this.response.status(this.status);
                this.response.send({
                    name: this.name,
                    message: this.message
                });
            }
        } else {
            log.warn(this.message);
        }
    }

    /**
     * This method will send an error report to our servers If
     * the user allowed it.
     */
    private sendErrorReport() {
        // TODO: Send type, message, stack and general information about the system (like DocSort version and os) to us.
    }
}

/**
 * Formats an error and prints it into console. Only use on unexpected errors.
 */
export async function formatError(error: ApplicationError) {
    console.log("")
    log.error(`${chalk.redBright("================= [ ERROR ] =================")}`)
    log.error(`${chalk.bold("Something unexpected happend (╯°□°）╯︵ ┻━┻")}`)
    log.error(`${chalk.bold("Please report the following error by creating an issue on GitHub:")}`)
    log.error(`${error.stack}`)
    log.error(`${chalk.bold("Please following our guide on how to create a helpful bug report here: COMING SOON")}`)
    log.error(`${chalk.redBright("================== [ END ] ==================")}`)
    console.log("")
}