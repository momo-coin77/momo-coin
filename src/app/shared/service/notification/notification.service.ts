import { Injectable } from '@angular/core';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class NotificationService {


    showNotification(from, align, colortype, icon, text, time?) {
        if (!time) {
            time = 3000;
        }
        $.notify({
            icon: icon,
            message: text
        }, {
            type: colortype,
            timer: time,
            placement: {
                from: from,
                align: align
            }
        });
    }
}
