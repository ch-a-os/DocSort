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
        log.exception("Predicted Error : " + err.note + " : " + err.name + " : " + err.message);
    } else {
        log.exception("Unpredicted Error : " + err.name + " : " + err.message);
    }
}