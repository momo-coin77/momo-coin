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
  notifications: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([])

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
    
      this.firebaseApi.getFirebaseDatabase()
      .ref(`notifications/${user.id.toString()}`)
      .orderByChild('read')
      .equalTo(MessageReadState.UNREAD)
        .on('child_removed', (snapshot) => this.removeNotification(snapshot.val()))
    });
  }

  removeNotification(msg:Record<string, any>)
  {
    let message:Message=new Message();
    message.hydrate(msg);
    let pos= this.listNotifications.findIndex((m:Message)=>m.idPack.toString()==message.idPack.toString())
    if(pos>-1)  this.listNotifications.splice(pos,1);
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
  findMessageByPackId(idPack:EntityID,packOwnerID:EntityID):Promise<ResultStatut>
  {
    console.log("IDpack ",idPack.toString())
    return new Promise<ResultStatut>((resolve,reject)=>{
      let message:Message = this.listNotifications.find((msg:Message)=>msg.idPack.toString()==idPack.toString());
      let result:ResultStatut = new ResultStatut();
      if(message)
      {
        result.result=message;
        return resolve(result);
      }
      this.firebaseApi
      .getFirebaseDatabase()
      .ref(`notifications/${packOwnerID.toString()}`)
      .orderByChild('idPack')
      .equalTo(idPack.toString())
      .limitToLast(1)
      .once('value',(data)=>{
        let kdata = data.val();
        console.log(kdata)
        let message:Message = new Message();
        for (let key in kdata) 
        {
          message.hydrate(kdata[key])
          // console.log("Message ",message,kdata[key])
        }
        result.result = message;
        resolve(result);
      })
    })
  }
  deleteNotification(message:Message):Promise<ResultStatut>
  {
// console.log("Message ",message)
    return new Promise<ResultStatut>((resolve,reject)=>{
      this.firebaseApi.delete(`notifications/${message.to.toString()}/${message.id.toString()}`)
      .then((result)=>{
        
        let pos=this.listNotifications.findIndex((msg:Message)=>message.idPack.toString()==msg.idPack.toString())
        // console.log("delete ",pos)
        if(pos>-1)
        {
          this.listNotifications.splice(pos,1);
          this.notifications.next(this.listNotifications);          
        }
        resolve(result);
      })
      .catch((error)=>reject(error))
    })
  }

  newNotifications(msg: Record<string, any>) {
    if (!msg) { return null; }
    for(let okey in msg)
    {      
      let message:Message=new Message();
      message.hydrate(msg[okey]);
      let pos= this.listNotifications.findIndex((m:Message)=>m.idPack.toString()==message.idPack.toString())
      if(pos<0) this.listNotifications.push(message)
    }
    this.notifications.next(this.listNotifications)
  }

  sendNotification(message: Message): Promise<ResultStatut> {
// console.log("Message send ",message)
    return this.firebaseApi.set(`notifications/${message.to.toString()}/${message.id.toString()}`, message.toString());
  }
}
