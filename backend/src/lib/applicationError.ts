import { Response, Request } from 'express';

export class ApplicationError extends Error {
    note: string;
    request: Request;
    response: Response;
    applicationError: boolean; // flag to correctly distinguish between Error and ApplicationError

    constructor(note: string, error: Error, request?: Request, response?: Response) {
        super();
        
        this.note = note;
        this.request = request;
        this.response = response;
        this.applicationError = true;

        // setting original error attributes
        this.name = error.name;
        this.message = error.message;
        this.stack = error.stack;
    }
}