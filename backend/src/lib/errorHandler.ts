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
            default: 'A requested resource couldn\'t be found: %'
        },
        AuthenticationError: {
            crititcal: false,
            default: 'A authentification of a user went wrong: %'
        },
        UncaughtError: {
            crititcal: true,
            default: null
        }
    }
    status: number;
    response: Response;

    /**
     * This class handles all our errors that may occur while runtime.
     * It will respond to the client with all necessary information if `response` isn't null. 
     * @param type Type of the error
     * @param message Custon message of error
     * @param response Express response to respond to the client
     * @param additionalData Appends the error message to give more information about the error
     */
    constructor(type: ERROR, message?: string, response?: Response, additionalData?: any) {
        super();
        const errorName = ERROR[type];
        let defaultMessage = null;
        try {
            defaultMessage = this.errors[errorName].default.replace('%', additionalData || 'Unknown');
        } catch(err) {}

        this.name = errorName || ERROR[ERROR.UncaughtError];
        this.message = message || defaultMessage || this.message;
        this.status = type;
        this.response = response;

        // Decide to throw error or just print a small line
        if(this.errors[ERROR[type]].crititcal) {
            Error.captureStackTrace(this);
        } else {
            log.warn(this.message);
        }

        if(this.response != undefined && !this.response.headersSent) {
            this.response.status(this.status);
            this.response.send({
                name: this.name,
                message: this.message
            });
        }
    }

    /**
     * This method will send an error report to our servers If
     * the user allowed it.
     */
    private sendErrorReport() {
        // TODO: Send type, message, stack and general information about the system (like DocSort and OS version) to us.
    }
}

/**
 * Formats an error and prints it into console. Only use on unexpected errors.
 */
export async function formatError(error: ApplicationError) {
    // Why not ¯\_(ツ)_/¯
    const errorMessages: Array<string> = [
        "Something unexpected happend (╯°□°）╯︵ ┻━┻",
        "ooops, you shouldn't be seeing this message :p",
        "Something went terribly wrong.",
        "It's not our fault, your computer is to blame.",
        "What have you done? ಠ╭╮ಠ",
        "That was planned, I think...",
        "What the fu**?!",
        "Ehmm, yeah... Something went wrong?",
        "Everything is fine",
        "Maybe it's our fault or yours.",
        "Sh*t, that was not intended.",
        "Ehmm, what? Something went wrong? I have to go ─=≡Σᕕ( ͡° ͜ʖ ͡°)ᕗ",
        "Web developers would say: 500 Internal Error",
        "The problem is usually 50cm in front of the screen.",
        "Error is: undefined. We can't even display an error ಥʖ̯ಥ",
        "It was Chuck Norris, I swear!",
        "At least your screen is not blue!",
        "Hey! It's not a bug, it's a feature!",
        "Report it at Por- GitHub!",
        "Look! There is a flying elephant!",
        "The following lines are not for people under 1337 years.",
        "Following lines may contain swearwords for programmers.",
        "Be aware of sharing the following error. It can lead to crying programmers.",
        "What do we got here? An error! AGAIN?!",
        "What would a developer say? \"We're just in alpha, this can happen\"",
        "It worked on my machine",
        "I think you're using DocSort wrong",
        "It seems like an error but it's not, it's a feature (⌐▀͡ ̯ʖ▀)",
        "It's aaaaaaall your fault",
        "WW91IGtuZXcgaXQgd2FzIEJhc2U2NCwgbm93IHlvdSBjYW4gZml4IGl0IGZvciB5b3Vyc2VsZiwgZGV2ZWxvcGVyLg==",
        "Guess what that means. Yes, someone messed something really up."
    ]
    const rnd: number = Number((Math.random() * ((errorMessages.length-1) - 0) + 0).toFixed(0));

    console.log("")
    log.error(`${chalk.redBright("================= [ ERROR ] =================")}`)
    log.error(`${chalk.bold(errorMessages[rnd])}`)
    log.error(`${chalk.bold("Please report the following error by creating an issue on GitHub:")}`)
    log.error(`${error.stack}`)
    log.error(`${chalk.bold("Please following our guide on how to create a helpful bug report here: COMING SOON")}`)
    log.error(`${chalk.redBright("================== [ END ] ==================")}`)
    console.log("")
}