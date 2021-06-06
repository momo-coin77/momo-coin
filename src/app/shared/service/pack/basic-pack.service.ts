import { Injectable } from "@angular/core";
import { User } from "firebase";
import { BehaviorSubject } from "rxjs";
import { Message } from "../../entity/chat";
import { EntityID } from "../../entity/EntityID";
import { Pack, PackBuyState, PackGain, PackState } from "../../entity/pack";
import { AuthService } from "../auth/auth.service";
import { EventService } from "../event/event.service";
import { FireBaseConstant } from "../firebase/firebase-constant";
import { FirebaseApi } from "../firebase/FirebaseApi";
import { ResultStatut } from "../firebase/resultstatut";
import { MarketService } from "../market/market.service";
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
        private userService:UserService,
        private marketService:MarketService
        ){
            this.eventService.loginEvent.subscribe((log)=>{
            //   if(!log) return;
            
              this.newPackHandler();  
            })
        }
    changePackStatus(idPack:EntityID)
    {
        let nstatus=PackState.ON_MARKET;
        return new Promise<ResultStatut>((resolve,reject)=>{
        this.firebaseApi.updates([{
            link:`packs/${idPack.toString()}/state`,
            data:nstatus
        }])
        .then((result)=>{
            if(this.packList.getValue().has(idPack.toString()))
                this.packList.getValue().get(idPack.toString()).state = nstatus;
            resolve(result)
        })
        .catch((error)=>{
            this.firebaseApi.handleApiError(error)
            reject(error);
        })
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
    getPackById(idPack:EntityID):Promise<ResultStatut>
    {
        let result=new ResultStatut()
        return new Promise<ResultStatut>((resolve,reject)=>{
            if(this.marketService.packs.getValue().has(idPack.toString()))
            {
                result.result=this.marketService.packs.getValue().get(idPack.toString())
                return resolve(result);
            }
            if(this.packList.getValue().has(idPack.toString())) 
            {
                result.result=this.packList.getValue().get(idPack.toString())
                return resolve(result);
            }
            this.getOnlinePack(idPack).then((result)=>resolve(result)).catch((error)=>reject(error));
        })
    }

    getOnlinePack(idPack:EntityID)
    {
        return new Promise<ResultStatut>((resolve,reject)=>{
            this.firebaseApi.fetchOnce(`packs/${idPack.toString()}`)
            .then((result:ResultStatut)=>{
                if(!result.result)
                {
                    // console.log("Dara pas ",result.result,idPack)
                    result.apiCode=FireBaseConstant.STORAGE_OBJECT_NOT_FOUND;
                    result.message="Data not found";
                    return reject(result);
                }
                let pack=new Pack();
                // console.log("Pack",result.result,idPack)
                pack.hydrate(result.result);
                this.packs.set(pack.id.toString(),pack);
                this.packList.next(this.packs);
                result.result=pack;
                resolve(result);
            })
            .catch((error:ResultStatut)=>{
                this.firebaseApi.handleApiError(error);
                reject(error);
            })
        })   
    }

    addPack(pack:Pack):Promise<ResultStatut>
    {
        return new Promise<ResultStatut>((resolve, reject) => {
            this.firebaseApi.updates([
                {
                    link: `packs/${pack.id}`,
                    data: pack.toString()
                }
            ])
            .then((result: ResultStatut) => {
                this.eventService.addPackEvent.next(pack);
                return resolve(result);
            })
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
        // console.log("PAck",this.authService.currentUserSubject.getValue().id.toString(), pack,pack.toString())
            let d:Date = new Date();
            d.setHours(d.getHours()+5);
            pack.maxPayDate=d.toISOString();
            pack.wantedGain=gain;
            pack.nextAmount = this.planService.calculePlan(pack.amount,gain.jour);
            this.firebaseApi.updates([
                {
                    link: `packs/${pack.id.toString()}/`,
                    data: pack.toString(),
                },
            ])
            .then((result) => {
                this.eventService.shouldPaidPackEvent.next(pack);
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

    confirmPaiementBySeller(pack: Pack,msg:Message): Promise<ResultStatut> {
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
            
            let newPack:Pack = new Pack();
            newPack.id.setId(pack.id.toString())
            newPack.amount=pack.nextAmount;
            newPack.payDate=pack.saleDate;
            // console.log("Wainted gain ",pack.payDate,pack.wantedGain)
            let dateForSelle=new Date(newPack.payDate);            
            dateForSelle.setDate(dateForSelle.getDate()+pack.wantedGain.jour)
            newPack.saleDate=dateForSelle.toISOString();
            newPack.buyState=PackBuyState.ON_WAITING_BUYER;
            newPack.plan=pack.wantedGain.jour
            newPack.wantedGain={jour:0,pourcent:0};
            newPack.idOwner.setId(pack.idBuyer.toString());
            newPack.idBuyer.setId(" ");
            // console.log("New PAck ", newPack.toString(),pack.toString())
            
            this.firebaseApi.updates([
                {
                    link: `packs/${pack.id.toString()}`,
                    data: newPack.toString()
                } 
            ])  
            .then((result)=> this.userHistoryService.addToHistory(pack))              
            .then((result)=> {
                this.eventService.packPaidEvent.next(newPack);
                this.eventService.addPackEvent.next(newPack);
                return this.userService.getUserById(pack.idBuyer);
            })
            .then((result)=>{
            // console.log("Here is a parentSponserHipId",result.result.parentSponsorShipId.toString())

                if(result.result.parentSponsorShipId.toString()!="") 
                {
                    return this.userService.getUserBySponsorId(result.result.parentSponsorShipId)                    
                }
                else 
                {
                    result.result=null;
                    return Promise.resolve(result)
                }
            }) 
            .then((result)=>{
                
                if(result.result!=null)
                {
                    result.result.bonus=this.memberShipService.membership(pack.amount,result.result.bonus)
                // console.log("Bonus ",result.result)
                    return this.firebaseApi.updates([
                        {
                            link:`users/${result.result.id.toString()}/bonus`,
                            data:result.result.bonus
                        }
                    ])
                }
                else return Promise.resolve(new ResultStatut())
            })
            .then((result)=> this.userNotificationService.deleteNotification(msg))
            // .then((result) => {
            //     let message: Message = new Message();
            //     message.from.setId(this.authService.currentUserSubject.getValue().id.toString());
            //     message.to.setId(newPack.idOwner.toString())
            //     message.date = (new Date()).toISOString();
            //     message.content = 'the payment of the pack has been confirmed by the seller';
            //     message.idPack = pack.id;
            //     return this.userNotificationService.sendNotification(message)
            // })
            .then((result)=> resolve(result))
            .catch((error) => {
                this.firebaseApi.handleApiError(error);
                reject(error);
            })


        })
    }

    

}