import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { IDocument } from '../interfaces';

@Component({
  selector: 'app-page-search',
  templateUrl: './page-search.component.html',
  styleUrls: ['./page-search.component.css']
})
export class PageSearchComponent implements OnInit {

  title: string;
  foundDocuments: Array<IDocument>;

  constructor(private api: ApiService) {
    this.title = "";
    this.foundDocuments = [];
  }

  ngOnInit() {
    this.doSearch()
  }

  async doSearch() {
    this.foundDocuments = await this.api.searchDocumentsByTitle(this.title); 
  }

  async download(doc) {
    console.log(doc)
    this.api.prompDownloadDocument(doc._id);
  }

  async delete(doc) {
    await this.api.deleteDocument(doc._id);
    this.foundDocuments = await this.api.searchDocumentsByTitle(this.title);
  }
}
