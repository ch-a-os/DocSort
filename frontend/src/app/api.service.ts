import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Router } from "@angular/router";
import { JwtHelperService } from '@auth0/angular-jwt';
import { SnotifyService, SnotifyPosition, SnotifyToastConfig, SnotifyToast } from 'ng-snotify';
import { IDocument, IDecodedJwt, IUploadFile, ITag } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private serverString: string;
  private jwt: string;
  public isLoggedIn: boolean;
  public decodedJwt: IDecodedJwt;

  constructor(private http: HttpClient, private router: Router, private snotifyService: SnotifyService) {
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
    this.router.navigate(['/home']);
    this.toastLoginSuccessfull();
    return true;
  }

  /**
   * ========= DOCUMENTS =========
   */

  async uploadFile(uploadData: IUploadFile) {
    // Create JSON object for the tags
    //const tags: Array<any> = [];

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
        headers: new HttpHeaders().set('token', this.jwt)
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
        headers: new HttpHeaders().set('token', this.jwt)
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
        headers: new HttpHeaders().set('token', this.jwt)
                .set('option-limit', amout.toString())
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
        headers: new HttpHeaders().set('token', this.jwt),
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
        headers: new HttpHeaders().set('token', this.jwt).set('Content-Type', 'application/json'),
        //@ts-ignore: It works, just not for TS
        body: {
          id: docID
        }
      }).toPromise();
    } catch(error) {
      console.error("error in deleteDocument:", error);
    }
    return response; 
  }

  prompDownloadDocument(docID): void {
    window.open(`${this.serverString}/getDocumentFile/${docID}?token=${this.jwt}`, "Download document")
    return;
  }

  /**
   * Searches documents based on their title and note
   * @param title Complete or part of the title
   */
  async searchDocumentsByTitle(title: string): Promise<Array<IDocument>> {
    let response = null;
    try {
      response = await this.http.get(`${this.serverString}/searchDocuments`, {
        reportProgress: true,
        observe: 'events',
        headers: new HttpHeaders().set('token', this.jwt)
          .set('option-where-title', title)
      }).toPromise()
    } catch (error) {
      console.log("error in searchDocumentsByTitle: " + error);
    }
    console.log(response.body);
    return response.body;
  }

  /**
   * Searches documents based on their title and note
   * @param note Complete or part of the note
   */
  async searchDocumentsByNote(note: string): Promise<Array<IDocument>> {
    let response = null;
    try {
      response = await this.http.get(`${this.serverString}/searchDocuments`, {
        reportProgress: true,
        observe: 'events',
        headers: new HttpHeaders().set('token', this.jwt)
          .set('option-where-note', note)
      }).toPromise()
    } catch (error) {
      console.log("error in searchDocumentsByNote: " + error);
    }
    console.log("Note:", response.body);
    return response.body;
  }

  /**
   * Searches documents based on their title and note
   * @param search Text that could be title and or the note
   */
  async searchDocumentsByTitleAndNote(search: string): Promise<Array<IDocument>> {
    console.log("Search for", search)
    let response = null;
    try {
      response = await this.http.get(`${this.serverString}/searchDocuments`, {
        reportProgress: true,
        observe: 'events',
        headers: new HttpHeaders().set('token', this.jwt)
          .set('option-where-title', search)
      }).toPromise()
    } catch (error) {
      console.log("error in searchDocumentsByNote: " + error);
    }
    console.log("Note:", response.body);
    return response.body;
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
        headers: new HttpHeaders().set('token', this.jwt)
      }).toPromise()
    } catch (error) {
      console.log("error in getTags: " + error);
    }
    return response.body;
  }


  async getAllTags() {
    let response = null;
    try {
      response = await this.http.get(`${this.serverString}/getAllTags`, {
        reportProgress: true,
        observe: 'response',
        headers: new HttpHeaders().set('token', this.jwt)
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