import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, from, Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { Discussion, Message } from '../../entity/chat';
import { Provider } from '../../entity/provider';
import { RealtimeService } from '../realtime/realtime.service';
import { AuthService } from '../auth/auth.service';
import { EventService } from '../event/event.service';
import { RealTimeChatMessageType, RealTimeInitErrorType, RealTimeMessage, RealTimeMessageType, UNKNOW_RECEIVER } from '../realtime/realtime-protocole';
import { PackageService } from './package.service';

@Injectable()
export class ChatRealtimeService {

  private listDiscusion: Discussion[] = [];
  listDiscusionSubject: BehaviorSubject<Discussion[]> = new BehaviorSubject<Discussion[]>(this.listDiscusion);
  currentUser:Provider = new Provider();

  constructor(private eventService:EventService,
    private realtimeService:RealtimeService,
    private authService:AuthService,) {

      this.eventService.loginRealtimeEvent
      .subscribe((value:boolean)=>{
        if(!value) return;
      this.currentUser= this.authService.currentUserSubject.getValue();
      this.realtimeService.send({
        senderID:this.currentUser.id.toString(),
        receiverID: UNKNOW_RECEIVER,
        type:RealTimeChatMessageType.GET_DISCUSSIONS
      });

      this.realtimeService.addListener(RealTimeChatMessageType.GET_DISCUSSIONS,(data:RealTimeMessage)=>{
        if(data.error==RealTimeInitErrorType.SUCCESS)
        {
          this.listDiscusion = data.data.map(disc => Discussion.hydrate(disc));
          this.listDiscusionSubject.next(this.listDiscusion);
          console.log("List discussion: ",this.listDiscusion)
        }
      })
    })
  }

  getUnreadDiscussion():Observable<Discussion>
  {
    return this.listDiscusionSubject.pipe(
      switchMap((disc:Discussion[])=>from(disc)),
      filter((disc:Discussion)=>disc.read==0),
      map((disc:Discussion)=>{
        this.eventService.findPackageEvent.next(disc.idProject.toString())
        return disc;
      })
    );
  }

 

 
}
