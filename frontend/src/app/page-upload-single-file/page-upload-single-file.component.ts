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

  @ViewChild('titleTextbox') titleTextbox: TextboxComponent;
  @ViewChild('noteTextbox') noteTextbox: TextboxComponent;
  selectedFile: File;
  document: IDocument;

  constructor(private api: ApiService) { }

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
    this.api.uploadFile({
      file: this.selectedFile,
      document: this.document
    });
  }

  tagsToSendList(idList: Array<string>) {
    this.document.tags_R = new Array();
    for (const id of idList) {
      this.document.tags_R.push(id);
    }
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit has finished');
  }

  getTitleValue() {
    this.document.title = this.titleTextbox.getValue();
    console.log("this.document.title=" + this.document.title);
  }

  getNoteValue() {
    this.document.note = this.noteTextbox.getValue();
    console.log("this.document.note=" + this.document.note);
  }

  test() {
    this.getTitleValue();
    this.getNoteValue();
  }
}