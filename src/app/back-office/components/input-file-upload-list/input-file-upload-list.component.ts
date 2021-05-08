import { Component, OnInit, Input, ComponentFactoryResolver, ViewContainerRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { InputFileUploadComponent } from "./input-file-upload/input-file-upload.component";
import { Document } from '../../../shared/entity/provider';


@Component({
  selector: 'app-input-file-upload-list',
  templateUrl: './input-file-upload-list.component.html',
  styleUrls: ['./input-file-upload-list.component.css']
})
export class InputFileUploadListComponent implements OnInit {
  // list of documents selected

  private nbInputFile: number[] = [];

  @ViewChildren(InputFileUploadComponent) inputFiles: QueryList<InputFileUploadComponent>;
  @Input() label:String="";
  @Input() accept:String="";
  constructor() { }

  ngOnInit(): void {
  }

  addDoc() {
    this.nbInputFile.push(0);
  }
  remove() {
  }
  getDocumentsList(): Document[] {
    let docs: Document[] = [];
    this.inputFiles.forEach((component: InputFileUploadComponent) => {
      component.documents.forEach((doc: Document) => docs.push(doc));
    });
    return docs;
  }

}
