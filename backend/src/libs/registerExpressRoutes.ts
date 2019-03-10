import login from "../endpoints/login";
import uploadSingleDocument from "../endpoints/uploadSingleDocument";
import getDocumentFile from "../endpoints/getDocumentFile";
import validateJWT from "./validateJwt";
import getAllTags from "../endpoints/getAllTags";
import getDocument from "../endpoints/getDocument";
import searchDocuments from "../endpoints/searchDocuments";
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

export function registerExpressRoutes(app) {
    app.get('/login', login);
    
    app.get('/searchDocuments', validateJWT, searchDocuments);
    app.get('/getDocument', validateJWT, getDocument);
    app.get('/getDocumentFile', validateJWT, getDocumentFile);
    app.get('/getAllTags', validateJWT, getAllTags);

    app.post('/uploadSingleDocument', validateJWT, upload.single('singleDocument'), uploadSingleDocument);
}