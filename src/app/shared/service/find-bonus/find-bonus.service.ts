import { Injectable } from '@angular/core';
import { gainConfig, Pack } from '../../entity/pack';
import { User } from '../../entity/user';
import { FirebaseApi } from '../firebase/FirebaseApi';
import { ResultStatut } from '../firebase/resultstatut';
import { PlanService } from '../opperations/plan.service';
import { UserHistoryService } from '../user-history/user-history.service';

@Injectable({
  providedIn: 'root'
})
export class FindBonusService {

  constructor(
    private firebaseApi:FirebaseApi,
    private historyService:UserHistoryService,
    private planService:PlanService
  ) { }
  
  
}
