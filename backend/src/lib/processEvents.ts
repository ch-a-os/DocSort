import { log } from "./logging";
import { ApplicationError } from "./applicationError";

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
        log.exception(`Application Error : ${err.note} : ${logString}`);
    } else {
        log.exception(`Unknown Error : ${logString}`);
    }
}