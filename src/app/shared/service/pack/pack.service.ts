import { Injectable } from '@angular/core';
import { Pack, PackBuyState, PackState } from '../../../shared/entity/pack';
import { EventService } from '../event/event.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ResultStatut } from '../firebase/resultstatut';
import { User } from '../../entity/user';
import { FirebaseApi } from '../firebase/FirebaseApi';
import { AuthService } from '../auth/auth.service';
import { Message } from '../../entity/chat';
import { UserNotificationService } from '../user-notification/user-notification.service';
import { EntityID } from '../../entity/EntityID';
import { UserHistoryService } from '../user-history/user-history.service';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class PackService {
    packs: Map<String, Pack> = new Map<String, Pack>();
    packList: BehaviorSubject<Map<String, Pack>> = new BehaviorSubject<Map<String, Pack>>(this.packs)

    packCollection: AngularFirestoreCollection;
    currentUser: User;

    constructor(
        private firestore: AngularFirestore,
        private firebaseApi: FirebaseApi,
        private authService: AuthService,
        private userNotificationService: UserNotificationService,
        private userHistoryService: UserHistoryService,
        private router: Router,
        private afs: AngularFirestore,
        private eventService: EventService) {
        this.packCollection = afs.collection('packs');
        this.authService.currentUserSubject.subscribe((user: User) => {
            this.currentUser = user;
        })
    }

    deletePack(packId: EntityID): Promise<ResultStatut> {
        return new Promise<ResultStatut>((resolve, reject) => {
            this.firebaseApi.delete(`users/${this.authService.currentUserSubject.getValue().id.toString()}/packs/${packId.toString()}`)
                .then((result: ResultStatut) => {
                    this.packs.delete(packId.toString());
                    resolve(result);
                });
        });
    }

    addPackForAdmin(pack: Pack, account: User): Promise<ResultStatut> {
        return new Promise<ResultStatut>((resolve, reject) => {
            this.firebaseApi.updates([
                {
                    link: `users/${this.authService.currentUserSubject.getValue().id}/${pack.id}`,
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
    AskForBuyPack(pack: Pack): Promise<ResultStatut> {
        return new Promise<ResultStatut>((resolve, reject) => {
            if (pack.state != PackState.ON_MARKET) {
                let result: ResultStatut = new ResultStatut();
                result.apiCode = ResultStatut.INVALID_ARGUMENT_ERROR;
                result.message = 'Pack is not on market';
                reject(result);
            }
            pack.buyState = PackBuyState.ON_WAITING_CONFRMATION_FOR_SELL;
            this.firebaseApi.updates([
                {
                    link: `packs/${pack.id.toString()}/buyState`,
                    data: pack.buyState
                }
            ])
                .then((result) => {
                    let message: Message = new Message();
                    message.from.setId(this.authService.currentUserSubject.getValue().id.toString());
                    message.to.setId(pack.idOwner.toString())
                    message.date = (new Date()).toISOString();
                    message.content = 'A user requests the purchase of this pack. please confirm the sale';
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

    acceptForBuyPack(pack: Pack, idBuyer: EntityID): Promise<ResultStatut> {
        return new Promise<ResultStatut>((resolve, reject) => {
            if (pack.state != PackState.ON_MARKET) {
                let result: ResultStatut = new ResultStatut();
                result.apiCode = ResultStatut.INVALID_ARGUMENT_ERROR;
                result.message = 'Pack is not on market';
                reject(result);
            }
            if (pack.buyState != PackBuyState.ON_WAITING_CONFRMATION_FOR_SELL) {
                let result: ResultStatut = new ResultStatut();
                result.apiCode = ResultStatut.INVALID_ARGUMENT_ERROR;
                result.message = 'No payment confirmation request was sent for this pack';
                reject(result);
            }
            pack.buyState = PackBuyState.ON_WAITING_BUYER_CONFIRMATION_PAIEMENT;
            pack.state = PackState.NOT_ON_MARKET;
            pack.idBuyer.setId(idBuyer.toString())
            this.firebaseApi.updates([
                {
                    link: `packs/${pack.id.toString()}/buyState`,
                    data: pack.buyState
                },
                {
                    link: `packs/${pack.id.toString()}/state`,
                    data: pack.state
                },
                {
                    link: `packs/${pack.id.toString()}/idBuyer`,
                    data: pack.idBuyer.toString()
                }
            ])
                .then((result) => {
                    let message: Message = new Message();
                    message.from.setId(this.authService.currentUserSubject.getValue().id.toString());
                    message.to.setId(idBuyer.toString())
                    message.date = (new Date()).toISOString();
                    message.content = 'The sale request has been accepted. made the payment';
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

    confirmBuyPack(pack: Pack): Promise<ResultStatut> {
        return new Promise<ResultStatut>((resolve, reject) => {
            if (pack.state == PackState.ON_MARKET) {
                let result: ResultStatut = new ResultStatut();
                result.apiCode = ResultStatut.INVALID_ARGUMENT_ERROR;
                result.message = 'Pack is already on market';
                reject(result);
            }
            if (pack.buyState != PackBuyState.ON_WAITING_BUYER_CONFIRMATION_PAIEMENT) {
                let result: ResultStatut = new ResultStatut();
                result.apiCode = ResultStatut.INVALID_ARGUMENT_ERROR;
                result.message = 'The pack do not wait for buyer\'s payment confirmation';
                reject(result);
            }

            pack.buyState = PackBuyState.ON_WAITING_SELLER_CONFIRMATION_PAIEMENT;
            this.firebaseApi.updates([
                {
                    link: `packs/${pack.id.toString()}/buyState`,
                    data: pack.buyState,
                },
                {
                    link: `packs/${pack.id.toString()}/idOwner`,
                    data: this.authService.currentUserSubject.getValue().id.toString(),
                },
            ])
                .then((result) => {
                    let message: Message = new Message();
                    message.from.setId(this.authService.currentUserSubject.getValue().id.toString());
                    message.to.setId(pack.idOwner.toString())
                    message.date = (new Date()).toISOString();
                    message.content = 'the payment of the pack has been made by the buyer';
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
            this.firebaseApi.updates([
                {
                    link: `packs/${pack.id.toString()}/buyState`,
                    data: pack.buyState
                },

            ])
                .then((result) => this.userHistoryService.addToHistory(pack))
                .then((result) => {
                    let newPack: Pack = new Pack();
                    newPack.buyState = PackBuyState.ON_WAITING_BUYER;
                    newPack.state = PackState.NOT_ON_MARKET;
                    newPack.idOwner


                    this.firebaseApi.updates([

                    ]);
                })
                .then((result) => {
                    let message: Message = new Message();
                    message.from.setId(this.authService.currentUserSubject.getValue().id.toString());
                    message.to.setId(pack.idBuyer.toString())
                    message.date = (new Date()).toISOString();
                    message.content = 'the payment of the pack has been made by the buyer';
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

    getPackList() {
        let list: Pack[] = [];
        // tslint:disable-next-line:forin
        for (const key in this.packs) {
            list.push(this.packs.get(key));
        }
        return list;
    }

    ///////////////
    
    _deletePack(id) {
        return this.packCollection.doc(id).delete();
    }
    updateStatus(data, id) {
    }

}
