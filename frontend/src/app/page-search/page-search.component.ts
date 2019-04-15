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

  searchData: ISearchData;

  //search: string;
  //searchBy: string;
  //docURL: SafeResourceUrl;
  foundDocuments: Array<IDocument>;
  stateCheckBox: IStateCheckBox;

  constructor(private api: ApiService) {
    this.searchData = {
      title: "",
      note: ""
    };
    //this.search = "";
    //this.searchBy = "Title";
    this.foundDocuments = [];
    this.stateCheckBox = {
      textRecognition: false,
      isInGroup: false,
      date: false
    }
  }

  ngOnInit() {
    this.doSearch()
    //this.docURL = "alkalökl"
  }

  async doSearch() {
    console.log(JSON.stringify(this.searchData));
    this.foundDocuments = await this.api.searchDocumentsByTitle(this.searchData.title);
    //if(this.searchBy == "Title") this.foundDocuments = await this.api.searchDocumentsByTitle(this.search);
    //if(this.searchBy == "Note") this.foundDocuments = await this.api.searchDocumentsByNote(this.search);
  }

  async download(doc) {
    await this.api.prompDownloadDocument(doc);
  }

  async delete(doc) {
    await this.api.deleteDocument(doc._id);
    await this.doSearch();
  }

  async test() {
    console.log(JSON.stringify(this.searchData));
    this.foundDocuments = await this.api.searchDocumentsByTitle(this.searchData.title);
  }

  tagsToSendList(idList: Array<string>) {
    this.searchData.tags = new Array();
    for (const id of idList) {
      this.searchData.tags.push(id);
    }
  }
}

interface IStateCheckBox {
  textRecognition: boolean;
  isInGroup: boolean;
  date: boolean;
}

interface ISearchData {
  title?: string;
  note?: string;
  primaryNumber?: string;
  secondaryNumber?: string;
  textRecognitionEnabled?: boolean;
  isInGroup?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
  tags?: Array<string>;
}
