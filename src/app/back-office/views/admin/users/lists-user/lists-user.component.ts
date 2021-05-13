import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { User } from '../../../../../shared/entity/user';
import { NotificationService } from '../../../../../shared/service/notification/notification.service';
import { UserService } from '../../../../../shared/service/user/user.service';

@Component({
  selector: 'app-lists-user',
  templateUrl: './lists-user.component.html',
  styleUrls: ['./lists-user.component.scss'],
})
export class ListsUserComponent implements OnInit {
  userStatus: boolean;
  users: User[] = [];
  search = '';
  searchUsers: User[] = [];
  waitResponse:boolean=false;

  constructor(private userService: UserService,private notifService:NotificationService) { }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.userService.usersSubject.subscribe((mapUser:Map<string,User>)=>{
      this.users = Array.from(mapUser.values())
      this.searchUser();
    })
  }

  changeStatus(user) {
    this.waitResponse=true;
    this.userService.changeStatus(user)
    .then((result)=>{
      console.log('staus' + user.status);
      this.waitResponse=false;
      this.notifService.showNotification('top', 'center', 'success', '', `\<b>Success !\</b>\<br>Account status has been successfully updated to '${user.status}'`);
    })
    .catch((error)=>{
      this.waitResponse=false;
      this.notifService.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Sorry !\</b>\<br>'+error.message);
    })
  }

  searchUser() {
    this.searchUsers =
      _.filter(this.users, (user) => _.includes(user.email, this.search) || _.includes(user.name, this.search) || _.includes(user.phone, this.search))
  }

  deleteUser(id) {
  }
}
