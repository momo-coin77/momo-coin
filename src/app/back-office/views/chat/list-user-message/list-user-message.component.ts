import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../../../shared/entity/user';
import { Message, Discussion } from '../../../../shared/entity/chat';
import { DiscussionItem } from '../chat/chat.component';
import { Provider } from '../../../../shared/entity/provider';

@Component({
  selector: 'app-list-user-message',
  templateUrl: './list-user-message.component.html',
  styleUrls: ['./list-user-message.component.css']
})
export class ListUserMessageComponent implements OnInit {
  @Input() listUser:DiscussionItem[]=[];
  selectedUser:Provider=new Provider();

  @Output() selectUserEvent:EventEmitter<DiscussionItem>=new EventEmitter<DiscussionItem>();
  constructor() { }

  ngOnInit(): void {
    console.log("listUSer ", this.listUser)
    if(this.listUser.length> 0) this.selectedUser = this.listUser[0].user;
  }
  selectUser(idDisc:String)
  {
    let discuss = this.listUser.find((disc:DiscussionItem)=> idDisc==disc.idDiscuss);
    this.selectedUser=discuss.user;
    this.selectUserEvent.emit(discuss);
  }

}
