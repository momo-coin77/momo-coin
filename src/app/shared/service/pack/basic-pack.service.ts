import { Injectable } from "@angular/core";
import { User } from "firebase";
import { BehaviorSubject } from "rxjs";
import { Pack, PackState } from "../../entity/pack";
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
            this.eventService.loginEvent.subscribe((log)=>{
            //   if(!log) return;
              this.newPackHandler();  
            })
        }
    
    newPackHandler()
    {
        this.firebaseApi
        .getFirebaseDatabase()
        .ref("packs")
        .on('child_added',(snapshot)=>{
            let pack:Pack=new Pack();
            pack.hydrate(snapshot.val())   
            if(!this.packs.has(pack.id.toString())) 
            {
                this.packs.set(pack.id.toString(),pack);
                this.packList.next(this.packs)
                console.log("pack ",pack)
            }
        })
    }
    changeStatusMarket(pack:Pack):Promise<ResultStatut>
    {
        return new Promise<ResultStatut>((resolve,reject)=>{
            let nstatus=PackState.ON_MARKET==pack.state?PackState.ON_MARKET:PackState.NOT_ON_MARKET;
            this.firebaseApi.updates([{
                link:`packs/${pack.id.toString()}/state`,
                data:nstatus
              }])
              .then((result)=>{
                this.packList.getValue().get(pack.id.toString()).state = nstatus;
                resolve(result)
              })
              .catch((error)=>{
                this.firebaseApi.handleApiError(error)
                reject(error);
              })
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