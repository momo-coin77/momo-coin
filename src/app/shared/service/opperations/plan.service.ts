import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
export class PlanService {

    calculePlan(amount: number, plan: number): number {
        if (plan == 5) {
            let nextAmount = amount * 20 / 100;
        // console.log(nextAmount);
            return amount + nextAmount;
        }
        if (plan == 10) {
            let nextAmount = amount * 45 / 100;
        // console.log(nextAmount);
            return amount + nextAmount;
        }
        if (plan == 20) {
            let nextAmount = amount * 110 / 100;
        // console.log(nextAmount);
            return amount + nextAmount;
        } else { return 0; }
    }
}