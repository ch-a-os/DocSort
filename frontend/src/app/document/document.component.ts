import { Component, OnInit, Input } from '@angular/core';
import { IDocument, IUser, ITag } from '../interfaces';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {

  @Input() data: IDocument;
  @Input() displayType: string;

  loadedTags: Array<ITag>;
  thumbnail?: any;
  preview?: any;
  original?: any;

  constructor(private api: ApiService) {
    this.loadedTags = new Array<ITag>();
  }

  delete() {
    this.api.deleteDocument(this.data._id);
  }

  download() {
    this.api.prompDownloadDocument(this.data);
  }

  /*show() {

  }*/

  /*loadTags() {

  }*/

  ngOnInit() {
  }

}
