import { Injectable } from '@angular/core';
import { gainConfig } from '../../entity/pack';
import { ConfigAppService } from '../config-app/config-app.service';

@Injectable({
    providedIn: 'root'
  })
export class PlanService {
    constructor(private configAppService:ConfigAppService){}

    calculePlan(amount: number, plan: number): number {
        let gainPlan=this.configAppService.gains.getValue().find((gain)=>gain.numberOfDay==plan);
        if(!gainPlan) return amount;

        return (amount*parseInt(gainPlan.percent) / 100) + amount
        
    }
}