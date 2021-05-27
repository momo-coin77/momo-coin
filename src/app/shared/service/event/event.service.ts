import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Bug } from '../../entity/bug';
import { Pack } from '../../entity/pack';
import { User } from '../../entity/user';

@Injectable()
export class EventService {
  loginEvent = new BehaviorSubject<User>(null);
  logoutEvent = new BehaviorSubject<boolean>(false);
  loginAdminEvent = new BehaviorSubject<boolean>(false);
  registerNewUserEvent = new BehaviorSubject<User>(null);
  addPackEvent = new BehaviorSubject<Pack>(null)
  shouldPaidPackEvent = new BehaviorSubject<Pack>(null);
  packPaidEvent=new BehaviorSubject<Pack>(null);
  newPackArrivedEvent = new BehaviorSubject<boolean>(false);
  newBugEvent = new BehaviorSubject<Bug>(null);
}
