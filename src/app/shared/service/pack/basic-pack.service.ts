import { Injectable } from "@angular/core";
import { User } from "firebase";
import { BehaviorSubject } from "rxjs";
import { Message } from "../../entity/chat";
import { EntityID } from "../../entity/EntityID";
import { Pack, PackBuyState, PackGain, PackState } from "../../entity/pack";
import { AuthService } from "../auth/auth.service";
import { EventService } from "../event/event.service";
import { FirebaseApi } from "../firebase/FirebaseApi";
import { ResultStatut } from "../firebase/resultstatut";
import { MembershipService } from "../opperations/Membership.service";
import { PlanService } from "../opperations/plan.service";
import { UserHistoryService } from "../user-history/user-history.service";
import { UserNotificationService } from "../user-notification/user-notification.service";
import { UserService } from "../user/user.service";

@Injectable({
    providedIn: 'root'
})
export class BasicPackService {
    packs: Map<String, Pack> = new Map<String, Pack>();
    packList: BehaviorSubject<Map<String, Pack>> = new BehaviorSubject<Map<String, Pack>>(this.packs)

    currentUser:User;

    constructor(private firebaseApi:FirebaseApi,
        private eventService:EventService,
        private authService:AuthService,
        private planService:PlanService,
        private userNotificationService:UserNotificationService,
        private userHistoryService:UserHistoryService,
        private memberShipService:MembershipService,
        private userService:UserService
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

    //Etape 1
    //L'acheteur envoi la demande d'achat en faisant le depos
    BuyAPack(pack: Pack,gain:PackGain): Promise<ResultStatut> {
        return new Promise<ResultStatut>((resolve, reject) => {
            if (pack.state != PackState.ON_MARKET) {
                let result: ResultStatut = new ResultStatut();
                result.apiCode = ResultStatut.INVALID_ARGUMENT_ERROR;
                result.message = 'Pack is not on market';
                reject(result);
            }
            if (pack.buyState != PackBuyState.ON_WAITING_BUYER) {
                let result: ResultStatut = new ResultStatut();
                result.apiCode = ResultStatut.INVALID_ARGUMENT_ERROR;
                result.message = 'The pack do not wait for buyer\'s payment';
                reject(result);
            }

            pack.state=PackState.NOT_ON_MARKET;
            pack.buyState = PackBuyState.ON_WAITING_SELLER_CONFIRMATION_PAIEMENT;
            pack.idBuyer.setId(this.authService.currentUserSubject.getValue().id.toString())

            let d:Date = new Date();
            d.setHours(d.getHours()+5);
            pack.maxPayDate=d.toISOString();
            pack.wantedGain=gain;
            pack.nextAmount = this.planService.calculePlan(pack.amount,gain.jour);
            this.firebaseApi.updates([
                {
                    link: `packs/${pack.id.toString()}`,
                    data: pack.toString(),
                },
            ])
            .then((result) => {
                
                let message: Message = new Message();
                message.from.setId(this.authService.currentUserSubject.getValue().id.toString());
                message.to.setId(pack.idOwner.toString())
                message.date = (new Date()).toISOString();
                message.content = 'the payment of the pack has been made by the buyer. Please confirm';
                message.idPack = pack.id;
                return this.userNotificationService.sendNotification(message)
            })
            .then((result) => resolve(result))
            .catch((error) => {
                this.firebaseApi.handleApiError(error);
                reject(error);
            })

        })
    }

    confirmPaiementBySeller(pack: Pack, idBuyer: EntityID): Promise<ResultStatut> {
        return new Promise<ResultStatut>((resolve, reject) => {
            if (pack.state == PackState.ON_MARKET) {
                let result: ResultStatut = new ResultStatut();
                result.apiCode = ResultStatut.INVALID_ARGUMENT_ERROR;
                result.message = 'Pack is already on market';
                reject(result);
            }
            if (pack.buyState != PackBuyState.ON_WAITING_SELLER_CONFIRMATION_PAIEMENT) {
                let result: ResultStatut = new ResultStatut();
                result.apiCode = ResultStatut.INVALID_ARGUMENT_ERROR;
                result.message = 'The pack is not awaiting confirmation by the seller';
                reject(result);
            }
                  
            pack.buyState = PackBuyState.ON_END_SEL;
            pack.state= PackState.NOT_ON_MARKET;
            pack.saleDate=(new Date()).toISOString();
            pack.nextAmount=this.planService.calculePlan(pack.amount,pack.wantedGain.jour)
            
            let newPack:Pack = Object.assign(Object.create(Object.getPrototypeOf(pack)),pack)
            newPack.amount=newPack.nextAmount;
            newPack.nextAmount=0;
            newPack.payDate=newPack.saleDate;
            let dateForSelle=new Date(newPack.payDate);
            dateForSelle.setDate(dateForSelle.getDate()+newPack.wantedGain.jour)
            newPack.saleDate=dateForSelle.toISOString();
            newPack.buyState=PackBuyState.ON_WAITING_BUYER;
            newPack.plan=newPack.wantedGain.jour
            newPack.wantedGain={};
            newPack.idOwner.setId(newPack.idBuyer.toString());
            newPack.idBuyer.setId(" ");

            return this.firebaseApi.updates([
                {
                    link: `packs/${pack.id.toString()}`,
                    data: newPack.toString()
                }, 
                {
                    link: `history/${pack.idOwner.toString()}`,
                    data: pack.toString()
                },     

            ])
                
            .then((result)=> this.userService.getUserById(pack.idBuyer))
            .then((result)=> {
                result.result.bonus=this.memberShipService.membership(pack.amount,result.result.bonus)
                return this.firebaseApi.updates([
                    {
                        link:`users/${result.result.sponsorshipId}/bonus`,
                        data:result.result.bonus
                    }
                ])
            })
            .then((result) => {
                let message: Message = new Message();
                message.from.setId(this.authService.currentUserSubject.getValue().id.toString());
                message.to.setId(pack.idOwner.toString())
                message.date = (new Date()).toISOString();
                message.content = 'the payment of the pack has been made by the buyer';
                message.idPack = pack.id;
                return this.userNotificationService.sendNotification(message)
            })
            .catch((error) => {
                this.firebaseApi.handleApiError(error);
                reject(error);
            })

        })
    }
}