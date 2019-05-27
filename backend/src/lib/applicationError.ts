import { Response, Request } from 'express';

export class ApplicationError extends Error {
    note: string;
    request: Request;
    response: Response;
    applicationError: boolean; // flag to correctly distinguish between Error and ApplicationError

    constructor(note?: string, error?: Error, message?: string, response?: Response, request?: Request) {
        super();
        
        this.note = note;
        this.request = request;
        this.response = response;
        this.message = message;
        this.applicationError = true;

        // setting original error attributes
        this.name = error.name;
        this.message = error.message;
        this.stack = error.stack;
    }

    /**
     * This method will send an error report to our
     * servers If the user allowed it.
     */
    private sendErrorReport() {
        // TODO: Send type, message, stack and general information about the system (like DocSort and OS version) to us.
    }
}