import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
export class DateService {

  calculeDate(plan: number, bayDate: Date): Date {
      if (plan == 5) {
          let saleDate = amount * 20 / 100;
          return amount + nextAmount;
      }
      if (plan == 10) {
          let saleDate = amount * 45 / 100;
          return amount + nextAmount;
      }
      if (plan == 20) {
          let saleDate = amount * 110 / 100;
          return amount + nextAmount;
      } else { return 0; }
  }
}