import validateJWT from "./validateJWT";
import * as multer from 'multer';

// Import endpoints
import getAllTags from "../endpoints/getAllTags";
import getDocument from "../endpoints/getDocument";
import searchDocuments from "../endpoints/searchDocuments";
import createTag from "../endpoints/createTag";
import login from "../endpoints/login";
import uploadSingleDocument from "../endpoints/uploadSingleDocument";
import getDocumentFile from "../endpoints/getDocumentFile";

const upload = multer({ storage: multer.memoryStorage() });

export function registerExpressRoutes(app) {
    app.get('/login', login);
    
    app.get('/searchDocuments', validateJWT, searchDocuments);
    app.get('/getDocument', validateJWT, getDocument);
    app.get('/getDocumentFile/:docID', validateJWT, getDocumentFile);
    app.get('/getAllTags', validateJWT, getAllTags);
    app.post('/createTag', validateJWT, createTag);

    app.post('/uploadSingleDocument', validateJWT, upload.single('singleDocument'), uploadSingleDocument);
}