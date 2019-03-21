import login from "../endpoints/login";
import uploadSingleDocument from "../endpoints/uploadSingleDocument";
import getDocumentFile from "../endpoints/getDocumentFile";
import getAllTags from "../endpoints/getAllTags";
import getDocument from "../endpoints/getDocument";
import searchDocuments from "../endpoints/searchDocuments";
import createTag from "../endpoints/createTag";
import updateTag from "../endpoints/updateTag";
import deleteTag from "../endpoints/deleteTag";
import { validateJWT } from "./validateJWT";
import updateDocument from "../endpoints/updateDocument";

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

export function registerExpressRoutes(app) {
    app.get('/login', login);
    
    /* DOCUMENT */
    app.get('/searchDocuments', validateJWT, searchDocuments);
    app.get('/getDocument', validateJWT, getDocument);
    app.patch('/updateDocument', validateJWT, updateDocument);
    //app.delete('/deleteDocument', validateJWT,);
    app.get('/getDocumentFile/:docID', validateJWT, getDocumentFile);   // To get the binary file
    
	/* TAG */
    app.get('/getAllTags', validateJWT, getAllTags);
    app.post('/createTag', validateJWT, createTag);
    app.patch('/updateTag', validateJWT, updateTag);
    app.delete('/deleteTag', validateJWT, deleteTag);

    app.post('/uploadSingleDocument', validateJWT, upload.single('file'), uploadSingleDocument);
}