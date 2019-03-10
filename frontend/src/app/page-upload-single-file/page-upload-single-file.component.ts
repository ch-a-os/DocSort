import { Component, OnInit } from '@angular/core';
import { ITag } from '../interfaces';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-page-upload-single-file',
  templateUrl: './page-upload-single-file.component.html',
  styleUrls: ['./page-upload-single-file.component.css']
})
export class PageUploadSingleFileComponent implements OnInit {
  selectedFile: File;
  uploadTitle: string;
  note: string;
  tags: Array<ITag|number>;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.uploadTitle = "";
    this.note = "";
    this.tags = new Array();
  }

  onFileChanged(files: FileList) {
    this.selectedFile = files.item(0);
  }

  onUpload() {
    this.api.uploadFile({
      singleDocument: this.selectedFile,
      title: this.uploadTitle,
      note: this.note,
      tags: this.tags
    });
  }

  tagsToSendList(tagList: Array<ITag>) {
    this.tags = new Array();
    for (const entry of tagList) {
      if(entry.id != null) {
        this.tags.push(entry.id);
      } else {
        this.tags.push(entry);
      }
    }
  }

}
