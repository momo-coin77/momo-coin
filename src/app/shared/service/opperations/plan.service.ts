import { Injectable } from '@angular/core';
import { gainConfig } from '../../entity/pack';

@Injectable({
    providedIn: 'root'
  })
export class PlanService {

    calculePlan(amount: number, plan: number): number {
        // if( plan in)
        if (plan == 5) {
            let nextAmount = amount * 15 / 100;
        // console.log(nextAmount);
            return amount + nextAmount;
        }
        if (plan == 10) {
            let nextAmount = amount * 35 / 100;
        // console.log(nextAmount);
            return amount + nextAmount;
        }
        if (plan == 20) {
            let nextAmount = amount * 85 / 100;
        // console.log(nextAmount);
            return amount + nextAmount;
        } else { return 0; }
    }
}