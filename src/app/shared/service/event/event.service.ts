import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Provider } from '../../entity/provider';

@Injectable()
export class EventService {
  loginEvent = new BehaviorSubject<boolean>(false)
  loginRealtimeEvent = new BehaviorSubject<boolean>(false);
  findPackageEvent = new BehaviorSubject<string>("");
  logoutEvent = new BehaviorSubject<boolean>(false);
}
