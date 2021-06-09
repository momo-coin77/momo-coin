import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatListOption, MatSelectionList } from '@angular/material';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
 
  emailForSearchUser:string=""

  constructor() { }

  ngOnInit(): void {
  }
  searchUser(userEmail)
  {
    this.emailForSearchUser=userEmail
  }
}
