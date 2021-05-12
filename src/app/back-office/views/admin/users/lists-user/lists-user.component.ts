import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { User } from '../../../../../shared/entity/user';
import { UserService } from '../../../../../shared/service/user/user.service';

@Component({
  selector: 'app-lists-user',
  templateUrl: './lists-user.component.html',
  styleUrls: ['./lists-user.component.scss'],
})
export class ListsUserComponent implements OnInit {

  users: User[] = [];
  search = '';
  searchUsers: User[] = [];

  constructor(private userServicee: UserService) { }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.userServicee.getListUser();
    return (user: User[]) => { this.searchUsers = this.users = user; };
  }

  chabgeStatus(user) {
    this.userServicee.chabgeStatus({ active: !user.active }, user.id);
  }

  searchClient() {
    this.searchUsers =
      // tslint:disable-next-line:max-line-length
      _.filter(this.users, (user) => _.includes(user.email, this.search) || _.includes(user.firstName, this.search) || _.includes(user.lastName, this.search))
  }

  deleteUser(id) {
  }
}
