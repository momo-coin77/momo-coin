import { Injectable } from '@angular/core';
import { Bug } from '../../entity/bug';
import { EventService } from '../event/event.service';
import { FirebaseApi } from '../firebase/FirebaseApi';

@Injectable({
  providedIn: 'root'
})
export class TrackBugService {

  constructor(private fireabseApi:FirebaseApi,private eventService:EventService) { 
    this.eventService.newBugEvent.subscribe((bug:Bug)=>{
      if(!bug) return;
      this.sendBug(bug);
    })

  }
  sendBug(bug:Bug)
  {
    this.fireabseApi.set(`bugs/${bug.id}`,bug.toString());
  }
}
