import { Injectable } from '@angular/core';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

    showNotification(from, align, colortype, icon, text) {

        $.notify({
            icon: icon,
            message: text
        }, {
            type: colortype,
            timer: 2000,
            placement: {
                from: from,
                align: align
            }
        });
    }
}
