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
  lastTitle: string;

  index: number;
  next: number;
  foundDocuments: Array<IDocument>;

  constructor(private api: ApiService) {
    this.index = 0;
    this.next = 25;
  }

  ngOnInit() {
    this.doSearch()
  }

  doSearch() {
    (setTimeout(async () => {
      if(this.title != null && this.title != this.lastTitle) {
        this.foundDocuments = await this.api.searchDocumentsByTitle(this.title, 0, 25); 
        this.lastTitle = this.title; 
      }
      this.doSearch();
    }, 500));
  }
}
