import { Response } from 'express';

export class ApplicationError extends Error {
    applicationError: boolean;
    note: string;
    response: Response;

    constructor(note?: string, message?: string, response?: Response) {
        super();
        this.note = note;
        this.response = response;
        this.message = message;
        this.applicationError = true;
    }

    /**
     * This method will send an error report to our
     * servers If the user allowed it.
     */
    private sendErrorReport() {
        // TODO: Send type, message, stack and general information about the system (like DocSort and OS version) to us.
    }
}