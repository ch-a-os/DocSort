/* Required for routing */
import login from "../endpoints/login";
import uploadSingleDocument from "../endpoints/uploadSingleDocument";
import getDocumentFile from "../endpoints/getDocumentFile";
import getAllTags from "../endpoints/getAllTags";
import getDocument from "../endpoints/getDocument";
import searchDocuments from "../endpoints/searchDocuments";
import createTag from "../endpoints/createTag";
import updateTag from "../endpoints/updateTag";
import deleteTag from "../endpoints/deleteTag";
import updateDocument from "../endpoints/updateDocument";
import deleteDocument from "../endpoints/deleteDocument";

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

/* To create Express server */
import cors from 'cors';
import * as bodyParser from 'body-parser';
import express from 'express';
import * as http from 'http';
import { validateJWT, addUserToRequest } from "./jwt";

/**
 * Inits the http server with Express.
 * @returns The Express application and the http server.
 */
export function createExpressServer(): { app: express.Application, server: http.Server } {
    const app = express();
    const server = http.createServer(app);
    app.use(bodyParser.json());
    app.use(cors());
    return { app, server };
}

/**
 * Sets all the http routes.
 * @param app Express application
 */
export function registerExpressRoutes(app: express.Application) {
    app.get('/login', login);
    
    /* DOCUMENT */
    app.get('/searchDocuments', addUserToRequest, validateJWT, searchDocuments);
    app.get('/getDocument', addUserToRequest, validateJWT, getDocument);
    app.get('/getDocumentFile/:docID', addUserToRequest, validateJWT, getDocumentFile);   // To get the binary file
    app.patch('/updateDocument', addUserToRequest, validateJWT, updateDocument);
    app.delete('/deleteDocument', addUserToRequest, validateJWT, deleteDocument);
    
	/* TAG */
    app.get('/getAllTags', addUserToRequest, validateJWT, getAllTags);
    app.post('/createTag', addUserToRequest, validateJWT, createTag);
    app.patch('/updateTag', addUserToRequest, validateJWT, updateTag);
    app.delete('/deleteTag', addUserToRequest, validateJWT, deleteTag);

    app.post('/uploadSingleDocument', addUserToRequest, validateJWT, upload.single('file'), uploadSingleDocument);
}