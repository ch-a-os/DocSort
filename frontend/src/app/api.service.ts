import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router } from "@angular/router";
import { JwtHelperService } from '@auth0/angular-jwt';
import { SnotifyService, SnotifyPosition, SnotifyToastConfig, SnotifyToast } from 'ng-snotify';
import { IDocument, IDecodedJwt, IUploadFile, ITag } from './interfaces';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as filesaver from 'file-saver';

export interface ISearchQuery {
  title?: string;
  note?: string;
  primaryNumber?: string;
  secondaryNumber?: string;
  textRecognition?: boolean;
  fileExtension?: string;
  group?: Array<any>;
  dateFrom?: Date;
  dateTo?: Date;
  tags?: Array<string>;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private jwt: string;
  public serverString: string;
  public isLoggedIn: boolean;
  public decodedJwt: IDecodedJwt;

  constructor(
    private http: HttpClient,
    private router: Router,
    private snotifyService: SnotifyService,
    private sanitizer: DomSanitizer
  ) {
    this.serverString = "http://localhost:9090";
    this.isLoggedIn = false;
    this.decodedJwt = null;
  }

  getToken() {
    return this.jwt;
  }

  /**
   * This function performs a login and sets isLoggedIn to true if successful.
   */
  async login(username, password): Promise<boolean> {
    const headers = new HttpHeaders({ 'username': username, 'password': password });
    let response = null;
    try {
      response = await this.http.get(`${this.serverString}/login`, { headers: headers }).toPromise();
    } catch (error) {
      console.log("error on login");
      this.toastLoginError();
      return false;
    }
    if(response == null) {
      console.log("error on login");
      this.toastLoginError();
      return false;
    }
    if(response['jwt'] == null) {
      console.log("error on login");
      this.toastLoginError();
      return false;
    }
    this.jwt = response['jwt'];
    this.isLoggedIn = true;
    const helper = new JwtHelperService();
    this.decodedJwt = helper.decodeToken(this.jwt);
    this.toastLoginSuccessfull();
    return true;
  }

  /**
   * ========= DOCUMENTS =========
   */

  async uploadFile(uploadData: IUploadFile) {
    let formData: FormData = new FormData();  
    formData.append('file',uploadData.file); 
    console.log("uploadData.document=", uploadData.document);
    formData.append('document', JSON.stringify(uploadData.document));
    let response = null;
    let toast: SnotifyToast = null;
    try {
      response = this.http.post(`${this.serverString}/uploadSingleDocument`, formData, {
        reportProgress: true,
        observe: 'events',
      }).toPromise();
      toast = this.snotifyService.async("Document is uploading ...", response, {
        showProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        position: SnotifyPosition.rightBottom
      });
      
      await response;
      this.snotifyService.remove(toast.id, true);
      this.snotifyService.success("Document uploaded", "Complete", {
        timeout: 4000,
        showProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        position: SnotifyPosition.rightBottom
      });
      

    } catch (error) {
      this.snotifyService.remove(toast.id, true);
      this.snotifyService.error("An error occurred while uploading", "Oh no...", {
        timeout: 4000,
        showProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        position: SnotifyPosition.rightBottom
      });
    }

  }

  async getAllDocumentsMeta(): Promise<Array<IDocument>> {
    let response = null;
    try {
      response = await this.http.get(`${this.serverString}/getAllDocuments`, {
        reportProgress: true,
        observe: 'response',
      }).toPromise();
    } catch (error) {
      console.log("error in getAllDocumentsMeta: " + error);
    }
    return response.body;
  }

  async getLatestDocuments(amout: number): Promise<Array<IDocument>> {
    let response = null;
    try {
      response = await this.http.get(`${this.serverString}/searchDocuments`, {
        reportProgress: true,
        observe: 'response',
        headers: new HttpHeaders().set('option-limit', amout.toString())
                .set('option-order-field', 'createdAt')
                .set('option-order-order', 'DESC')
      }).toPromise();
    } catch (error) {
      console.log("error in getAllDocumentsMeta: " + error);
    }
    return response.body;
  }

  async downloadDocument(docID): Promise<HttpResponse<Object>> {
    let response = null;
    try {
      console.debug("Sending request:", `${this.serverString}/getDocumentFile/${docID}`)
      response = await this.http.get(`${this.serverString}/getDocumentFile/${docID}`, {
        reportProgress: true,
        observe: 'body',
        responseType: "blob"
      }).toPromise();
    } catch(error) {
      console.error("error in downloadDocument:", error);
    }
    return response;
  }

  async deleteDocument(docID): Promise<HttpResponse<Object>> {
    let response = null;
    try {
      response = await this.http.delete(`${this.serverString}/deleteDocument`, {
        reportProgress: true,
        observe: 'body',
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
        //@ts-ignore: Body is not implemented in the TS-definition of a HTTP-DELETE request
        body: {
          id: docID
        }
      }).toPromise();
    } catch(error) {
      console.error("error in deleteDocument:", error);
    }
    return response; 
  }

  async prompDownloadDocument(doc: IDocument): Promise<void> {
    let response = null;
    try {
      response = await this.http.get(`${this.serverString}/getDocumentFile/${doc._id}`, {
        reportProgress: true,
        observe: 'body',
        responseType: 'blob'
      }).toPromise();
      const blob = new Blob([response], { type: doc.fileExtension });
      let shortenTitle: string = doc.title;
      if(doc.title.length > 10) {
        shortenTitle = doc.title.substr(0, 25) + "...";
      }
      filesaver.saveAs(blob, `${doc.number.primary}.${doc.number.secondary}_${shortenTitle}_.${doc.fileExtension}`);
    } catch(error) {
      console.error("error in prompDownloadDocument:", error);
    }
  }

  /**
   * Performs a search request and returns a array of documents matching `searchQuery`.
   * @param searchQuery Objects that defines in which field(s) should be searched and for what.
   */
  async doSearch(searchQuery: ISearchQuery): Promise<any> {
    let headers: HttpHeaders = new HttpHeaders();
    if(searchQuery.title != undefined && searchQuery.title != "") headers = headers.append('option-where-title', searchQuery.title);
    if(searchQuery.note != undefined && searchQuery.note != "") headers = headers.append('option-where-note', searchQuery.note);
    if(searchQuery.primaryNumber != undefined && searchQuery.note != "") headers = headers.append('option-where-number-primary', searchQuery.primaryNumber);
    if(searchQuery.secondaryNumber != undefined && searchQuery.note != "") headers = headers.append('option-where-number-secondary', searchQuery.secondaryNumber);
    if(searchQuery.fileExtension != undefined && searchQuery.fileExtension != "") headers = headers.append('option-where-fileextension', searchQuery.fileExtension);
    if(searchQuery.tags != undefined && searchQuery.tags.length != 0) headers = headers.append('option-where-tags', `${searchQuery.tags}`);
    if(searchQuery.textRecognition != undefined && searchQuery.textRecognition) headers = headers.append('option-where-textRecognition-enabled', searchQuery.textRecognition.toString());
    if(searchQuery.dateFrom != undefined) headers = headers.append('option-where-created-from', searchQuery.dateFrom.toString());
    if(searchQuery.dateTo != undefined) headers = headers.append('option-where-created-to', searchQuery.dateTo.toString());

    try {
      const response = await this.http.get(`${this.serverString}/searchDocuments`, {
        reportProgress: true,
        observe: 'response',
        headers: headers
      }).toPromise();
      return response.body;
    } catch(error) {
      console.error("error in searchDocumentsByNote: " + error);
      return null;
    }
  }

  /**
   * ========= TAGS =========
   */

  async getTags(): Promise<Array<ITag>> {
    let response = null;
    try {
      response = await this.http.get(`${this.serverString}/getAllTags`, {
        reportProgress: true,
        observe: 'events',
      }).toPromise()
    } catch (error) {
      console.log("error in getTags: " + error);
    }
    if(response == null) {
      return new Array<ITag>();
    }
    if(response.body == null) {
      return new Array<ITag>();
    }
    return response.body;
  }


  async getAllTags() {
    let response = null;
    try {
      response = await this.http.get(`${this.serverString}/getAllTags`, {
        reportProgress: true,
        observe: 'response'
      }).toPromise();
      console.log(`getAllTags responsed with ${response.body.length} entries`);
      return response.body;
    } catch (error) {
      console.log(`error in getAllTags: ${error}`);
      return new Array();
    }
  }

  /**
   * TOAST
   */

  toastLoginError() {
    this.snotifyService.error("Error on login", {
      timeout: 2000,
      showProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      position: SnotifyPosition.rightBottom
    });
  }
  
  toastLoginSuccessfull() {
    this.snotifyService.success("Login ok", {
      timeout: 2000,
      showProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true
    });
  }
  
}