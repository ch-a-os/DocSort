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
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as http from 'http';
import { validateJWT } from "./jwt";

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
    app.get('/searchDocuments', validateJWT, searchDocuments);
    app.get('/getDocument', validateJWT, getDocument);
    app.get('/getDocumentFile/:docID', validateJWT, getDocumentFile);   // To get the binary file
    app.patch('/updateDocument', validateJWT, updateDocument);
    app.delete('/deleteDocument', validateJWT, deleteDocument);
    
	/* TAG */
    app.get('/getAllTags', validateJWT, getAllTags);
    app.post('/createTag', validateJWT, createTag);
    app.patch('/updateTag', validateJWT, updateTag);
    app.delete('/deleteTag', validateJWT, deleteTag);

    app.post('/uploadSingleDocument', validateJWT, upload.single('file'), uploadSingleDocument);
}