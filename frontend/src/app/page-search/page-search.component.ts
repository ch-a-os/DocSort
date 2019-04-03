import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { IDocument } from '../interfaces';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-page-search',
  templateUrl: './page-search.component.html',
  styleUrls: ['./page-search.component.css']
})
export class PageSearchComponent implements OnInit {

  search: string;
  searchBy: string;
  docURL: SafeResourceUrl;
  foundDocuments: Array<IDocument>;

  constructor(private api: ApiService) {
    this.search = "";
    this.searchBy = "Title";
    this.foundDocuments = [];
  }

  ngOnInit() {
    this.doSearch()
    this.docURL = "alkalökl"
  }

  async doSearch() {
    if(this.searchBy == "Title") this.foundDocuments = await this.api.searchDocumentsByTitle(this.search);
    if(this.searchBy == "Note") this.foundDocuments = await this.api.searchDocumentsByNote(this.search);
  }

  async download(doc) {
    await this.api.prompDownloadDocument(doc);
  }

  async delete(doc) {
    await this.api.deleteDocument(doc._id);
    await this.doSearch();
  }
}
