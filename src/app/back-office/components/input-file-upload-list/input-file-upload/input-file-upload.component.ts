import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { FormControlName, Validators, FormControl } from '@angular/forms';
import { Document } from '../../../../shared/entity/provider';


@Component({
  selector: 'app-input-file-upload',
  templateUrl: './input-file-upload.component.html',
  styleUrls: ['./input-file-upload.component.css']
})
export class InputFileUploadComponent implements OnInit 
{
  inputFile:FormControl= new FormControl('',[Validators.required])
  documents:Document[]=[];
  @Input() multiple:boolean=false;
  @Input() accept:String="";
  constructor() { }

  ngOnInit(): void {

  }
  fileUpload(e) {
    this.documents = [];
    for (let file of e.target.files) {
      console.log(file)
      let fileReader: FileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.addEventListener('load', (e) => {
        let doc: Document = new Document();
        doc.name = file.name;
        doc.lastModified = file.lastModified;
        doc.size = file.size;
        doc.type = file.type;
        doc.data = fileReader.result;
        // console.log("File ",doc)
        this.documents.push(doc);
      });
    }
  }

}
