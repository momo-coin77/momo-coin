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

  constructor(private chatService: ChatService,
    private userService: UserService,
    private authService: AuthentificationService,
    private notification: NotificationService,
    // private chatRTService: ChatRealtimeService
    ) { }


  ngOnInit(): void {

    // this.chatRTService.listDiscusionSubject.subscribe((discussions:Discussion[])=>{
    //   this.discusionList = discussions;

    //   this.discusionList.forEach((discuss:Discussion) => {
    //     let d:DiscussionItem={};
    //     d.idDiscuss=discuss._id;
    // if(discuss.inter1!=this.authService.currentUserSubject.getValue()._id)
    // {
    //   this.userService.getUserById(discuss.inter1).then((user:Provider)=> {
    //     console.log("userProvider",user);
    //     d.user=user
    //   })
    // }
    // else this.userService.getUserById(discuss.inter2).then((user:Provider)=> d.user=user)
    // d.lastMessage=discuss.chats[discuss.chats.length-1];
    // this.userDiscussionList.push(d);
    // });
    // })
  }

  // selectedUserDiscuss(userDiscuss: DiscussionItem): void {
  //   //this.selectedDiscussion = this.discusionList.find((d:Discussion)=>d._id==userDiscuss.idDiscuss)
  // }
  // newMessage(msg: String): void {
  //   let message: Message = new Message();
  //   message.content = msg;
  //   message._id = generateId();
  //   // message.from=this.authService.currentUserSubject.getValue().uuid;
  //   this.selectedDiscussion.subscribe((discuss: Discussion) => {
  //     if (discuss.inter1 != this.authService.currentUserSubject.getValue().uuid) message.to = discuss.inter1;
  //     else message.to = discuss.inter2;
  //   });
  //   //Apres avoir ajouté a la liste de discussion suivante on peut mettre a jour le backend
  //   this.chatService.newMessage(message, '');
  //   // doit avoir une procédure si le message est parti ou pas
  // }
  showNotification(from, align, colortype, icon, text) {
    this.notification.showNotification(from, align, colortype, icon, text);
  }

}
