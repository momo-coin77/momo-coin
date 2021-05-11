import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../entity/user';

@Injectable()
export class EventService {
  loginEvent = new BehaviorSubject<User>(null);
  logoutEvent = new BehaviorSubject<boolean>(false);
}
