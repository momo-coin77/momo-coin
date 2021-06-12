import { Component, Input, OnInit } from '@angular/core';
import { User } from 'firebase';
import { gainConfig, Pack } from '../../../../shared/entity/pack';

@Component({
  selector: 'app-user-transfer-pack',
  templateUrl: './user-transfer-pack.component.html',
  styleUrls: ['./user-transfer-pack.component.css']
})
export class UserTransferPackComponent implements OnInit {
  gainList = Object.keys(gainConfig).map((key) => Object.create({}, { value: { value: gainConfig[key] }, key: { value: key } }));

  @Input() user:User;
  @Input() pack:Pack;
  emailForSearchUser:string=""
  selectedUser:User=null;
  constructor() { }

  ngOnInit(): void {
  }
  setSelectedUser(user:User)
  {
    this.selectedUser=user;
  }
  selectedEmailUser(email)
  {
    this.emailForSearchUser=email;
  }
  confirm()
  {

  }
}
