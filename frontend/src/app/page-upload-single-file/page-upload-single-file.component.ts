import { Component, OnInit, ViewChild } from '@angular/core';
import { ITag, IDocument } from '../interfaces';
import { ApiService } from '../api.service';
import { TextboxComponent } from '../textbox/textbox.component';

@Component({
  selector: 'app-page-upload-single-file',
  templateUrl: './page-upload-single-file.component.html',
  styleUrls: ['./page-upload-single-file.component.scss']
})
export class PageUploadSingleFileComponent implements OnInit {

  @ViewChild('titleTextbox')
  titleTextbox: TextboxComponent;

  @ViewChild('noteTextbox')
  noteTextbox: TextboxComponent;
  
  selectedFile: File;
  document: IDocument;
  viewIsInitialized: boolean;

  constructor(private api: ApiService) {
    this.viewIsInitialized = false;
  }

  ngOnInit() {
    this.document = {};
    this.document.title = "";
    this.document.note = "";
    this.document.tags_R = new Array();
    this.document.number = {};
    this.document.textRecognition = {};
  }

  onFileChanged(files: FileList) {
    this.selectedFile = files.item(0);
  }

  onUpload() {
    if(this.getTitleValue() && this.getNoteValue()) {
      this.api.uploadFile({
        file: this.selectedFile,
        document: this.document
      });
    }
  }

  tagsToSendList(idList: Array<string>) {
    this.document.tags_R = new Array();
    for (const id of idList) {
      this.document.tags_R.push(id);
    }
  }

  ngAfterViewInit() {
    this.viewIsInitialized = true;
  }

  getTitleValue(): boolean {
    if(this.viewIsInitialized) {
      this.document.title = this.titleTextbox.getValue();
      return true;
    } else {
      console.log("Error: Tried to 'getTitleValue()' before 'ngAfterViewInit()' was finished.");
      return false;
    }
  }

  getNoteValue(): boolean {
    if(this.viewIsInitialized) {
      this.document.note = this.noteTextbox.getValue();
      return true;
    } else {
      console.log("Error: Tried to 'getTitleValue()' before 'ngAfterViewInit()' was finished.");
      return false;
    }
  }
}