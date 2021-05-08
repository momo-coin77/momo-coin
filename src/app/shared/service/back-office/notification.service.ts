import { ApiService } from '../api/api.service';

export class NotificationService {
    headers ={};
    constructor(private api:ApiService) { 
        this.headers={
            'Authorization': 'Bearer ' + this.api.getAccessToken(),
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          };
    }

    getNotification(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            
        })
    }
}
