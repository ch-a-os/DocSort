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
    this.initializeDocument();
  }

  ngAfterViewInit() {
    this.viewIsInitialized = true;
  }

  initializeDocument() {
    this.document = {};
    this.document.title = "";
    this.document.note = "";
    this.document.tags_R = new Array();
    this.document.number = {};
    this.document.textRecognition = {};
  }

  selectedFileChanged(files: FileList) {
    this.selectedFile = files.item(0);
  }

  getFieldValues() {
    if(this.viewIsInitialized) {
      this.document.title = this.titleTextbox.getValue();
      this.document.note = this.noteTextbox.getValue();
      return true;
    } else {
      console.log("Error: Tried to access ViewChild before 'ngAfterViewInit()' was finished.");
      return false;
    }
  }

  uploadDocument() {
    if(this.getFieldValues()) {
      this.api.uploadFile({
        file: this.selectedFile,
        document: this.document
      });
    } else {
      console.log("Error: 'getValues()' returned false.");
    }
  }

  tagsToSendList(idList: Array<string>) {
    this.document.tags_R = new Array();
    for (const id of idList) {
      this.document.tags_R.push(id);
    }
  }

  getFileSize(size: number) {
    return (size / 1024 / 1024).toFixed(2)
  }
}