import login from "../endpoints/login";
import uploadSingleDocument from "../endpoints/uploadSingleDocument";
import getDocumentFile from "../endpoints/getDocumentFile";
import validateJWT from "./validateJWT";
import getAllTags from "../endpoints/getAllTags";
import getDocument from "../endpoints/getDocument";
import { searchDocuments } from "../endpoints/searchDocuments";
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

export function registerExpressRoutes(app) {
    app.get('/login', login);
    
    app.get('/searchDocuments', validateJWT, searchDocuments);
    app.get('/getDocument', validateJWT, getDocument);
    app.get('/getDocumentFile/:docID', validateJWT, getDocumentFile);
    
	/* TAG */
    app.get('/getAllTags', validateJWT, getAllTags);
    app.post('/createTag', validateJWT, createTag);
    app.patch('/updateTag', validateJWT, updateTag);
    app.delete('/deleteTag', validateJWT, deleteTag);

    app.post('/uploadSingleDocument', validateJWT, upload.single('file'), uploadSingleDocument);
}