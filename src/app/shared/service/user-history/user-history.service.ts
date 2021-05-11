import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Pack } from '../../entity/pack';
import { User } from '../../entity/user';
import { AuthService } from '../auth/auth.service';
import { EventService } from '../event/event.service';
import { FirebaseApi } from '../firebase/FirebaseApi';
import { ResultStatut } from '../firebase/resultstatut';

@Injectable({
  providedIn: 'root'
})
export class UserHistoryService {

  historyList:Pack[]=[];
  history:BehaviorSubject<Pack[]>=new BehaviorSubject<Pack[]>(this.historyList) 
  

  constructor(
    private authService:AuthService,
    private eventService:EventService,
    private firebaseApi:FirebaseApi
    ) 
    {
      

        
    }

  

}
