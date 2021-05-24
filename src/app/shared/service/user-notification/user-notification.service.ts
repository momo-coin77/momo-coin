import { N } from '@angular/cdk/keycodes';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Message, MessageReadState } from '../../entity/chat';
import { EntityID } from '../../entity/EntityID';
import { User } from '../../entity/user';
import { AuthService } from '../auth/auth.service';
import { EventService } from '../event/event.service';
import { FirebaseApi } from '../firebase/FirebaseApi';
import { ResultStatut } from '../firebase/resultstatut';
import { NotificationService } from '../notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class UserNotificationService {
  currentUser: User;
  listNotifications: Message[] = [];
  notifications: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>(this.listNotifications)

  constructor(private authService: AuthService,
    private eventService: EventService,
    private notificationService: NotificationService,
    private firebaseApi: FirebaseApi) {
    this.authService.currentUserSubject.subscribe((user: User) => {
      this.currentUser = user;
      if (!user) { return; }
      this.firebaseApi.getFirebaseDatabase()
        .ref(`notifications/${user.id.toString()}`)
        .orderByChild('read')
        .equalTo(MessageReadState.UNREAD)
        .on('value', (snapshot) => this.newNotifications(snapshot.val()))
    });

    this.eventService.loginEvent.subscribe((user: User) => {
      if (!user) { return; }
      this.firebaseApi.getFirebaseDatabase()
      .ref(`notifications/${user.id.toString()}`)
      .orderByChild('read')
      .equalTo(MessageReadState.UNREAD)
        .on('child_changed', (snapshot) => this.newNotification(snapshot.val()))
    });
  }

  newNotification(msg:Record<string, any>)
  {
    let message:Message=new Message();
    message.hydrate(msg);
    let pos= this.listNotifications.findIndex((m:Message)=>m.idPack.toString()==message.idPack.toString())
    if(pos<0) this.listNotifications.push(message)
    else
    {
      this.listNotifications.slice(pos,1);
      // this.listNotifications.push(message);
      // this.listNotifications.reverse();
    }
    this.notifications.next(this.listNotifications);
  }
  marskAskRead(message:Message):Promise<ResultStatut>
  {
    return this.firebaseApi.updates([
      {
        link:`notifications/${message.to.toString()}/${message.id.toString()}/read`,
        data:MessageReadState.READ
      }
    ]);
  }
  deleteNotification(message:Message):Promise<ResultStatut>
  {
    return new Promise<ResultStatut>((resolve,reject)=>{
      this.firebaseApi.delete(`notifications/${message.to.toString()}/${message.id.toString()}`)
      .then((result)=>{
        let pos=this.listNotifications.findIndex((msg:Message)=>message.idPack.toString()==msg.idPack.toString())
        // if(pos>-1)
        // {
        //   this.listNotifications.splice(pos,1);
        //   this.notifications.next(this.listNotifications);          
        // }
        resolve(result);
      })
      .catch((error)=>reject(error))
    })
  }
  newNotifications(msg: Record<string, any>) {
    if (!msg) { return null; }

    for(let okey in msg)
    {
      let message: Message = new Message();
      message.hydrate(msg[okey]);

      this.listNotifications.push(message);
      // this.notificationService.showNotification('top', 'right', 'success', '<i class="bi bi-chat-left-dots-fill"></i>', message.content.toString())
    }
    this.notifications.next(this.listNotifications);
  }

  sendNotification(message: Message): Promise<ResultStatut> {
    return this.firebaseApi.set(`notifications/${message.to.toString()}/${message.id.toString()}`, message.toString());
  }
}
