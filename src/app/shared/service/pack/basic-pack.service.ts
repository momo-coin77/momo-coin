import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Message } from "../../entity/chat";
import { EntityID } from "../../entity/EntityID";
import { MIN_RETREIVAL_BONUS, Pack, PackBuyState, PackGain, PackState } from "../../entity/pack";
import { User } from "../../entity/user";
import { AuthService } from "../auth/auth.service";
import { EventService } from "../event/event.service";
import { FireBaseConstant } from "../firebase/firebase-constant";
import { FirebaseApi } from "../firebase/FirebaseApi";
import { ResultStatut } from "../firebase/resultstatut";
import { MarketService } from "../market/market.service";
import { MembershipService } from "../opperations/Membership.service";
import { PlanService } from "../opperations/plan.service";
import { ProfilService } from "../profil/profil.service";
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
        private marketService:MarketService,
        private userProfil:ProfilService
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
    splitPack(pack:Pack,amount:number):Promise<ResultStatut>
    {
        return new Promise<ResultStatut>((resolve,reject)=>{
            if(amount>=pack.amount)
            {
                let result:ResultStatut=new ResultStatut();
                result.message="Cannot perform division. the amount is greater than or equal to the amount of the pack"
                result.code=ResultStatut.INVALID_ARGUMENT_ERROR;
                result.apiCode=ResultStatut.INVALID_ARGUMENT_ERROR;
                return reject(result);
            }

            let newPack:Pack=new Pack();
            newPack.hydrate(pack.toString());
            newPack.id.setId(new EntityID().toString());

            newPack.amount=amount;
            pack.amount=pack.amount-amount;
            this.firebaseApi.updates([
                {
                    link:`packs/${pack.id.toString()}/amount`,
                    data:pack.amount
                },
                {
                    link:`packs/${newPack.id.toString()}`,
                    data:newPack.toString()
                }
            ])
            .then((result:ResultStatut)=>resolve(result))
            .catch((error:ResultStatut)=>{
                this.firebaseApi.handleApiError(error);
                reject(error)
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
    deletePack(pack:Pack):Promise<ResultStatut>
    {
        return new Promise<ResultStatut>((resolve,reject)=>{
            this.firebaseApi.delete(`packs/${pack.id}`)
            .then((result:ResultStatut)=>resolve(result))
            .catch((error:ResultStatut)=>{
                this.firebaseApi.handleApiError(error);
                reject(error)
            });
        })
    }
    changeStatusMarket(pack:Pack):Promise<ResultStatut>
    {
        return new Promise<ResultStatut>((resolve,reject)=>{
            let nstatus= PackState.ON_MARKET==pack.state?PackState.NOT_ON_MARKET:PackState.ON_MARKET;
            // console.log("new status",nstatus,pack.state)
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

    addPack(pack:Pack,user:User,isBonusPack=false):Promise<ResultStatut>
    {
        return new Promise<ResultStatut>((resolve, reject) => {
            this.firebaseApi.updates([
                {
                    link: `packs/${pack.id}`,
                    data: pack.toString()
                }
            ])
            .then((result:ResultStatut)=>{
                this.eventService.addPackEvent.next(pack)
                if(isBonusPack) return Promise.resolve(new ResultStatut())
                else return this.userProfil.addParentBonus(user,pack.amount)}
            )
            .then((result:ResultStatut)=> resolve(result))
            .catch((error) => {
                this.firebaseApi.handleApiError(error);
                reject(error);
            })
        })
    }

    transfertBonusToPack()
    {
     return new Promise<ResultStatut>((resolve,reject)=>{
       let user:User = this.authService.currentUserSubject.getValue();
       let result:ResultStatut=new ResultStatut()
       if(user.bonus<MIN_RETREIVAL_BONUS)
       {
         result.apiCode=ResultStatut.INVALID_ARGUMENT_ERROR;
         result.message="\<b>Oops!!\</b>The bonus amount must be greater than 15000";
         return reject(result);
       }
       let newPack = new Pack();
       newPack.payDate=new Date().toISOString();
       newPack.saleDate=newPack.payDate;
       newPack.state=PackState.ON_MARKET;
       newPack.amount=MIN_RETREIVAL_BONUS;
       newPack.idOwner.setId(user.id.toString())
    //    console.log("bonus pack ",newPack)
       this.addPack(newPack,user,true)
       .then((result:ResultStatut)=>this.userProfil.retreiveBonus(MIN_RETREIVAL_BONUS))
       .then((result:ResultStatut)=>resolve(result))
       .catch((error:ResultStatut)=>{
           if(error.apiCode!=ResultStatut.INVALID_ARGUMENT_ERROR) this.firebaseApi.handleApiError(error);
           reject(error);
       })
    })
   }

    //Etape 1
    //L'acheteur envoi la demande d'achat en faisant le depos
    BuyAPack(p: Pack,gain:PackGain): Promise<ResultStatut> {
        return new Promise<ResultStatut>((resolve, reject) => {
            this.getOnlinePack(p.id)
            .then((result:ResultStatut)=>{
                let pack:Pack=result.result;
                if (pack.state != PackState.ON_MARKET) {
                    let result: ResultStatut = new ResultStatut();
                    result.apiCode = ResultStatut.INVALID_ARGUMENT_ERROR;
                    result.message = 'Pack is not on market';
                    return reject(result);
                }
                if (pack.buyState != PackBuyState.ON_WAITING_BUYER) {// pack.idBuyer.toString().trim()!=""
                    let result: ResultStatut = new ResultStatut();
                    result.apiCode = ResultStatut.INVALID_ARGUMENT_ERROR;
                    result.message = 'The pack do not wait for buyer\'s payment';
                    return reject(result);
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
                    message.idPack.setId(pack.id.toString());
                    message.id.setId(pack.id.toString())
                    return this.userNotificationService.sendNotification(message)
                })
                .then((result) => resolve(result))
                .catch((error) => {
                    this.firebaseApi.handleApiError(error);
                    reject(error);
                })
            })
        })
    }

    confirmPaiementBySeller(p: Pack,msg:Message,user:User=this.authService.currentUserSubject.getValue(),onLine:boolean=true): Promise<ResultStatut> {
        return new Promise<ResultStatut>((resolve, reject) => {
            this.getOnlinePack(p.id)
            .then((result:ResultStatut)=>{
                let pack:Pack=result.result;
                if(!onLine) pack=p;
                if (pack.state == PackState.ON_MARKET) {
                    let result: ResultStatut = new ResultStatut();
                    result.apiCode = ResultStatut.INVALID_ARGUMENT_ERROR;
                    result.message = 'Pack is already on market';
                    return reject(result);
                }
                if (pack.buyState != PackBuyState.ON_WAITING_SELLER_CONFIRMATION_PAIEMENT) {//|| pack.idBuyer.toString().trim()==""
                    let result: ResultStatut = new ResultStatut();
                    result.apiCode = ResultStatut.INVALID_ARGUMENT_ERROR;
                    result.message = 'The pack is not awaiting confirmation by the seller';
                    return reject(result);
                }
                pack.buyState = PackBuyState.ON_END_SEL;
                pack.state= PackState.NOT_ON_MARKET;
                pack.saleDate=pack.saleDate==""?(new Date()).toISOString():pack.saleDate;
                // pack.nextAmount=this.planService.calculePlan(pack.amount,pack.wantedGain.jour)
                
                let newPack:Pack = new Pack();
                newPack.id.setId(pack.id.toString())
                newPack.amount=pack.nextAmount;
                newPack.payDate=pack.saleDate;

                let dateForSelle=new Date(newPack.payDate); 
                // console.log("here date", pack.wantedGain,dateForSelle.getDate()+pack.wantedGain.jour)           
                dateForSelle.setDate(dateForSelle.getDate()+pack.wantedGain.jour)
                newPack.saleDate=dateForSelle.toISOString();
                newPack.buyState=PackBuyState.ON_WAITING_BUYER;
                newPack.plan=pack.wantedGain.jour
                newPack.wantedGain={jour:0,pourcent:0};
                newPack.idOwner.setId(msg.from.toString());
                newPack.idBuyer.setId(" ");

                this.firebaseApi.updates([
                    {
                        link: `packs/${pack.id.toString()}`,
                        data: newPack.toString()
                    } 
                ])  
                .then((result)=> this.userHistoryService.addToHistory(pack,user.id))              
                .then((result)=> {
                    this.eventService.packPaidEvent.next(newPack);
                    this.eventService.addPackEvent.next(newPack);
                    return this.userNotificationService.deleteNotification(msg)                
                })
                .then((result)=>this.userService.getUserById(msg.from,true))
                .then((result)=>this.userProfil.addParentBonus(result.result,newPack.amount))            
                .then((result)=> resolve(result))
                .catch((error) => {
                    this.firebaseApi.handleApiError(error);
                    reject(error);
                })
            })
        })
    }

    

}