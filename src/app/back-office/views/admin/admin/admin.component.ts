import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatListOption, MatSelectionList } from '@angular/material';
import { User } from '../../../../shared/entity/user';
import { DataStateUpdateService } from '../../../../shared/service/data-state-update/data-state-update.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
 
  emailForSearchUser:string=""
  selectedUser:User=null;
  constructor(private dataUpdateService:DataStateUpdateService) { }

  ngOnInit(): void {
  }
  searchUser(userEmail)
  {
    this.emailForSearchUser=userEmail
  }
  setSelectedUser(user:User)
  {
    this.selectedUser=user;
  }
  checkPackList()
  {
    this.dataUpdateService.clearAndCheckDateBasePack()
  }
}
