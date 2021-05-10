import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Discussion, Message } from '../../../../shared/entity/chat';
import { generateId } from '../../../../shared/entity/entity';
import { Provider } from '../../../../shared/entity/provider';
// import { ChatRealtimeService } from '../../../../shared/service/back-office/chat-realtime.service';
import { ChatService } from '../../../../shared/service/back-office/chat.service';
import { AuthentificationService } from '../../../../shared/service/auth/authentification.service';
import { NotificationService } from '../../../../shared/service/notification/notification.service';
import { UserService } from '../../../../shared/service/user/user.service';

declare var $: any;

export interface DiscussionItem {
  idDiscuss?: String;
  user?: Provider;
  lastMessage?: Message;
  online?: boolean;
}
export interface DiscussionMessage {
  from?: Provider;
  to?: Provider;
  senderIsAuthUser?: boolean;
  message?: Message;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  discusionList: Discussion[] = [];
  userDiscussionList: DiscussionItem[] = [];
  selectedDiscussion: Observable<Discussion> = new Observable<Discussion>();
  messageToDisplay: DiscussionMessage[] = [];

  constructor(
    private notification: NotificationService,
    ) { }


  ngOnInit(): void {}

  showNotification(from, align, colortype, icon, text) {
    this.notification.showNotification(from, align, colortype, icon, text);
  }

}
