import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { UserService } from '../user/user.service';

@Injectable({
    providedIn: 'root'
})
export class ServicesService {

    headers = {};
    serviceStatut: string;
    transportStatus: string;
    confTransport: string;

    constructor(private api: ApiService) {
        this.headers = {
            'Authorization': 'Bearer ' + this.api.getAccessToken(),
            'Content-Type': 'application/json',
            // 'Accept': 'application/json'
        };
    }

    // Get informations about current service
    getServiceInfo() {
    }

    // Start, end or stop a transport by the carrier
    transport(providerId: string, serviceId: string, serviceStatut: string): Promise<any> {

        const param = {
            'providerId': providerId,
            'serviceId': serviceId,
            'serviceStatut': serviceStatut,
        };
        return new Promise<any>((resolve, reject) => {
          this.api.post('backend/link', param, this.headers)
            .subscribe((result) => {
              if (result && result.resultCode == 0) {
                  if (serviceStatut == 'start') {
                      this.transportStatus = 'start';
                    } else if (serviceStatut == 'end') {
                        this.transportStatus = 'end';
                    } else if (serviceStatut == 'stop') {
                      this.transportStatus = 'stop';
                    }
                resolve(true);
              } else { reject(result); }
            }, (error: any) => reject(error));
        });
    }

    // at the end of the transport, the customer confirms or refuses the service provided
    confirmTransport(customerId: string, serviceId: string, confirmStatut: string): Promise<any> {
        const param = {
            'customerId': customerId,
            'serviceId': serviceId,
            'confirmStatut': confirmStatut,
        };
        return new Promise<any>((resolve, reject) => {
          this.api.post('backend/link', param, this.headers)
            .subscribe((result) => {
              if (result && result.resultCode == 0) {
                  if (confirmStatut == 'confirm') {
                      this.confTransport = 'confirm';
                    } else if (confirmStatut == 'end') {
                        this.confTransport = 'end';
                    }
                resolve(true);
              } else { reject(result); }
            }, (error: any) => reject(error));
        });
    }

}
