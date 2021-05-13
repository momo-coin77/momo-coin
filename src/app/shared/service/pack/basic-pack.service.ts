import { Injectable } from "@angular/core";
import { User } from "firebase";
import { BehaviorSubject } from "rxjs";
import { Pack } from "../../entity/pack";
import { AuthService } from "../auth/auth.service";
import { EventService } from "../event/event.service";
import { FirebaseApi } from "../firebase/FirebaseApi";
import { ResultStatut } from "../firebase/resultstatut";

@Injectable({
    providedIn: 'root'
})
export class BasicPackService {
    packs: Map<String, Pack> = new Map<String, Pack>();
    packList: BehaviorSubject<Map<String, Pack>> = new BehaviorSubject<Map<String, Pack>>(this.packs)

    currentUser:User;

    constructor(private firebaseApi:FirebaseApi,
        private eventService:EventService
        ){
            this.eventService.loginAdminEvent.subscribe((log)=>{
                if(!log) return;
                this.firebaseApi.getFirebaseDatabase().ref("pack")
                .on()
            })
        }

    addPack(pack:Pack):Promise<ResultStatut>
    {
        return new Promise<ResultStatut>((resolve, reject) => {
            this.firebaseApi.updates([
                {
                    link: `users/${pack.idOwner.toString()}/packs/${pack.id}`,
                    data: true
                },
                {
                    link: `packs/${pack.id}`,
                    data: pack.toString()
                }
            ])
            .then((result: ResultStatut) => resolve(result))
            .catch((error) => {
                this.firebaseApi.handleApiError(error);
                reject(error);
            })
        })
    }
}