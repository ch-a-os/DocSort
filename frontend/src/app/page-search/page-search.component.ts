import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ApiService } from '../api.service';
import { IDocument } from '../interfaces';
import { SafeResourceUrl } from '@angular/platform-browser';

import { TextboxComponent } from '../textbox/textbox.component';

@Component({
  selector: 'app-page-search',
  templateUrl: './page-search.component.html',
  styleUrls: ['./page-search.component.scss']
})
export class PageSearchComponent implements OnInit, AfterViewInit {

  @ViewChild('titleTextbox')
  titleTextbox: TextboxComponent;

  @ViewChild('noteTextbox')
  noteTextbox: TextboxComponent;

  @ViewChild('primaryNumberTextbox')
  primaryNumberTextbox: TextboxComponent;

  @ViewChild('secondaryNumberTextbox')
  secondaryNumberTextbox: TextboxComponent;

  searchData: ISearchData;
  viewIsInitialized: boolean;

  //search: string;
  //searchBy: string;
  //docURL: SafeResourceUrl;
  foundDocuments: Array<IDocument>;
  stateCheckBox: IStateCheckBox;

  constructor(private api: ApiService) {
    this.viewIsInitialized = false;
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

  ngAfterViewInit() {
    this.viewIsInitialized = true;
  }

  async doSearch() {
    console.log(JSON.stringify(this.searchData));
    this.foundDocuments = await this.api.searchDocumentsByTitle(this.searchData.title);
  }

  async download(doc) {
    await this.api.prompDownloadDocument(doc);
  }

  async delete(doc) {
    await this.api.deleteDocument(doc._id);
    await this.doSearch();
  }

  async search() {
    this.refreshSearchData();
    this.foundDocuments = await this.api.searchDocumentsByTitle(this.searchData.title);
  }

  refreshSearchData() {
    this.getTitleValue();
    this.getNoteValue();
    this.getPrimaryNumberValue();
    this.getPrimaryNumberValue();
  }

  getTitleValue() {
    if(this.viewIsInitialized) {
      this.searchData.title = this.titleTextbox.getValue();
      return true;
    } else {
      console.log("Error: Tried to 'getTitleValue()' before 'ngAfterViewInit()' was finished.");
      return false;
    }
  }

  getNoteValue() {
    if(this.viewIsInitialized) {
      this.searchData.note = this.noteTextbox.getValue();
      return true;
    } else {
      console.log("Error: Tried to 'getNoteValue()' before 'ngAfterViewInit()' was finished.");
      return false;
    }
  }

  getPrimaryNumberValue() {
    if(this.viewIsInitialized) {
      this.searchData.primaryNumber = this.primaryNumberTextbox.getValue();
      return true;
    } else {
      console.log("Error: Tried to 'getPrimaryNumberValue()' before 'ngAfterViewInit()' was finished.");
      return false;
    }
  }

  getSecondaryNumberValue() {
    if(this.viewIsInitialized) {
      this.searchData.secondaryNumber = this.secondaryNumberTextbox.getValue();
      return true;
    } else {
      console.log("Error: Tried to 'getSecondaryNumberValue()' before 'ngAfterViewInit()' was finished.");
      return false;
    }
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
