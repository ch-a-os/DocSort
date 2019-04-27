import { Component, OnInit } from '@angular/core';
import { ITag, IDocument } from '../interfaces';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-page-upload-single-file',
  templateUrl: './page-upload-single-file.component.html',
  styleUrls: ['./page-upload-single-file.component.scss']
})
export class PageUploadSingleFileComponent implements OnInit {
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

  getFileSize(size: number) {
    return (size / 1024 / 1024).toFixed(2)
  }
}