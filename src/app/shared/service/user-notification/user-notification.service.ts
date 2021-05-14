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
        .on('child_added', (snapshot) => this.newNotification(snapshot.val()))
    });

    this.eventService.loginEvent.subscribe((user: User) => {
      if (!user) { return; }
      this.firebaseApi.getFirebaseDatabase()
        .ref(`notifications/${user.id.toString()}`)
        .equalTo(MessageReadState.UNREAD, 'read')
        .on('child_added', (snapshot) => this.newNotification(snapshot.val()))
    });
  }

  newNotification(msg: Record<string, any>) {
    if (!msg) { return null; }
    let message: Message = new Message();
    message.hydrate(msg);
    this.listNotifications.push(message);
    this.notifications.next(this.listNotifications);
    // tslint:disable-next-line:max-line-length
    this.notificationService.showNotification('top', 'right', 'success', '<i class="bi bi-chat-left-dots-fill"></i>', message.content.toString())
  }
  sendNotification(message: Message): Promise<ResultStatut> {
    return this.firebaseApi.set(`notifications/${message.to.toString()}/${message.id}`, message.toString());
  }
}
