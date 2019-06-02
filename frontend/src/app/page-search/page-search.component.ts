import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ApiService, ISearchQuery } from '../api.service';
import { IDocument } from '../interfaces';

import { TextboxComponent } from '../textbox/textbox.component';

@Component({
  selector: 'app-page-search',
  templateUrl: './page-search.component.html',
  styleUrls: ['./page-search.component.scss']
})
export class PageSearchComponent implements AfterViewInit {

  @ViewChild('titleTextbox')
  titleTextbox: TextboxComponent;

  @ViewChild('noteTextbox')
  noteTextbox: TextboxComponent;

  @ViewChild('primaryNumberTextbox')
  primaryNumberTextbox: TextboxComponent;

  @ViewChild('secondaryNumberTextbox')
  secondaryNumberTextbox: TextboxComponent;

  @ViewChild('fileExtensionTextbox')
  fileExtensionTextbox: TextboxComponent;

  searchData: ISearchQuery;
  viewIsInitialized: boolean;
  foundDocuments: Array<IDocument>;
  stateCheckBox: IStateCheckBox;

  constructor(private api: ApiService) {
    this.viewIsInitialized = false;
    this.searchData = {};
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
    this.doSearch();
  }

  async doSearch() {
    if(this.getFieldValues()) {
      this.foundDocuments = await this.api.doSearch(this.searchData);
    }
  }

  async download(document) {
    await this.api.prompDownloadDocument(document);
  }

  async delete(document) {
    await this.api.deleteDocument(document._id);
    await this.doSearch();
  }

  getFieldValues() {
    if(this.viewIsInitialized) {
      this.searchData.title = this.titleTextbox.getValue();
      this.searchData.note = this.noteTextbox.getValue();
      this.searchData.primaryNumber = this.primaryNumberTextbox.getValue();
      this.searchData.secondaryNumber = this.secondaryNumberTextbox.getValue();
      this.searchData.fileExtension = this.fileExtensionTextbox.getValue();
      this.searchData.textRecognition = this.stateCheckBox.textRecognition;
      if(!this.stateCheckBox.date) {
        this.searchData.dateFrom = undefined;
        this.searchData.dateTo = undefined;
      }
      return true;
    } else {
      console.error("Error: Tried to 'getFieldValues()' before 'ngAfterViewInit()' was finished.");
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