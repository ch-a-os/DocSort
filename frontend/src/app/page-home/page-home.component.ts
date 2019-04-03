import { Component, OnInit} from '@angular/core';
import { ApiService } from '../api.service';
import { IDocument } from '../interfaces';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-page-home',
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.css']
})
export class PageHomeComponent implements OnInit {
  title = 'docSort';
  allDocuments: Array<IDocument> = [];

  constructor(private api: ApiService) {
  }

  async ngOnInit() {
    this.allDocuments = await this.api.getLatestDocuments(5);
    console.log(this.allDocuments);
  }

  async download(doc) {
    this.api.prompDownloadDocument(doc);
  }

  async delete(doc) {
    await this.api.deleteDocument(doc._id);
    this.allDocuments = await this.api.getLatestDocuments(5);
  }

}