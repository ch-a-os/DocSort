import { Response } from 'express';

export class ApplicationError extends Error {
    applicationError: boolean;
    note: string;
    response: Response;

    constructor(note?: string, response?: Response) {
        super();
        this.note = note;
        this.response = response;
        this.applicationError = true;
    }
}