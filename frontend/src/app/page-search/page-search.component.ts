import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ApiService } from '../api.service';
import { IDocument } from '../interfaces';

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
  foundDocuments: Array<IDocument>;
  stateCheckBox: IStateCheckBox;

  constructor(private api: ApiService) {
    this.viewIsInitialized = false;
    this.searchData = {
      title: "",
      note: ""
    };
    this.foundDocuments = [];
    this.stateCheckBox = {
      textRecognition: false,
      isInGroup: false,
      date: false
    }
  }

  ngOnInit() {
    this.doSearch();
  }

  ngAfterViewInit() {
    this.viewIsInitialized = true;
  }

  async doSearch() {
    console.log("Called.")
    this.foundDocuments = await this.api.searchDocumentsByTitle(this.searchData.title);
  }

  async download(document) {
    await this.api.prompDownloadDocument(document);
  }

  async delete(document) {
    await this.api.deleteDocument(document._id);
    await this.doSearch();
  }

  async search() {
    if(this.getFieldValues()) {
      this.foundDocuments = await this.api.searchDocumentsByTitle(this.searchData.title);
    }
  }

  getFieldValues() {
    if(this.viewIsInitialized) {
      this.searchData.title = this.titleTextbox.getValue();
      this.searchData.note = this.noteTextbox.getValue();
      this.searchData.primaryNumber = this.primaryNumberTextbox.getValue();
      this.searchData.secondaryNumber = this.secondaryNumberTextbox.getValue();
      return true;
    } else {
      console.log("Error: Tried to 'getFieldValues()' before 'ngAfterViewInit()' was finished.");
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
