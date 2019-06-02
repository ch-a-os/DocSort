import { log } from "./logging";
import { ApplicationError } from "./applicationError";
import chalk from 'chalk';

export function setProcessEvents() {
    process.on('uncaughtException', (err: Error | ApplicationError) => {
        handleError(err);
    });
    process.on('unhandledRejection', (err: ApplicationError | Error) => {
        handleError(err);
    });
}

function handleError(err: ApplicationError | Error) {
    let logString =  `${err.name} : ${err.message} : ${err.stack}`;
    if('applicationError' in err) {
        if(err.response != null)
        {
            if(!err.response.headersSent) {
                err.response.status(500);
                err.response.send({
                    name: "unhandledRejection"
                });
            }
        }
        log.exception(`${chalk.redBright("Predicted Error: ")} ${chalk.bold(err.note)} : ${err.name} => ${err.message} (find more in frontend)`);
    } else {
        log.exception(`${chalk.redBright("Unpredicted Error: ")} ${chalk.bold(err.name)} => ${err.message} (find more in frontend)`);
    }
}