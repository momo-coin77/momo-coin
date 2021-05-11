import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { ToastrService } from 'ngx-toastr';
import { Pack, packBuilder } from '../../../shared/entity/pack';
import { Provider, ServiceOfProvider, Zone } from '../../entity/provider';
import { EventService } from '../event/event.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { TransactionService } from '../transaction/transaction.service';
import { FetchApiService } from '../fetch-api.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';



@Injectable({
    providedIn: 'root'
})
export class PackService {
    packs: Map<String, Pack> = new Map<String, Pack>();
    packList: BehaviorSubject<Map<String, Pack>> = new BehaviorSubject<Map<String, Pack>>(this.packs)
    headers = {};
    constructor(
        private firestore: AngularFirestore,
        private fetchApi: FetchApiService,
        private router: Router,
        private toastr: ToastrService,
        private transactionService: TransactionService,
        private eventService: EventService) {

        this.eventService.findPackEvent.subscribe((PackId: string) => {
            this.findPackById(PackId);
        })
    }

    findLocalPacksById(id: String): Pack {
        if (this.packs.has(id)) { return this.packs.get(id); }
        return null;
    }

    findPackById(id: String): Promise<Pack> {
        if (id.length == 0) { return; }
        return new Promise((resolve, reject) => {
            if (this.packs.has(id.toString())) { resolve(this.packs.get(id.toString())); }
            else {
                this.get(`packs/${id}`)
                    .subscribe(success => {
                        if (success && success.resultCode == 0) {
                            let aPack: Pack = packBuilder(success.result);
                            if (!this.packs.has(aPack.idPack.toString())) {
                                this.packs.set(aPack.idPack.toString(), aPack);
                                this.packList.next(this.packs);
                            }
                            resolve(aPack);
                        } else { reject(null); }
                    }, (error: any) => reject(null));
            }
        });
    }

    get(endpoint: string): Observable<any> {
        return this.firestore.collection<any>(`${endpoint}`)
            .snapshotChanges()
            .pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return { id, ...data };
                    })
                )
            );
    }

    getPackList() {
        let list: Pack[] = [];
        // tslint:disable-next-line:forin
        for (const key in this.packs) {
            list.push(this.packs.get(key));
        }
        return list;
    }

    getAllpacksUser(): Promise<any> {
        return new Promise((resolve, reject) => {
            // this.api.get('requester/service/list', this.headers)
            //     .subscribe((response: any) => {
            //         if (response) {
            //             if (response.resultCode == 0) {
            //                 response.result.map((pkg: Record<string, any>) => {
            //                     let aPack: Pack = PackBuilder(pkg);
            //                     if (!this.packs.has(aPack.idPack)) { this.packs.set(aPack.idPack.toString(), aPack); }
            //                     this.transactionService.setTransactionFromAPI(pkg);
            //                 })
            //                 this.packList.next(this.packs);
            //                 resolve(response);
            //             }
            //             reject(response)
            //         }

            //     }, (error: any) => {
            //         reject(error);
            //     });
        });
    }


    PackCreation(data: Pack): Promise<any> {
        return new Promise((resolve, reject) => {
            //     this.fetchApi.update(`users/${this.users[position].id}/`, newAccount)
            //         .subscribe(success => {
            //             if (success.resultCode === 0) {
            //                 resolve(success.result.idService);
            //             }
            //             else {
            //                 reject(success);
            //             }
            //         }, error => {
            //             reject(error);
            //         });
        })

    }

    // permet d'update les infos d'un Pack
    updatePack(nid: string, data: Pack): Promise<any> {

        return new Promise((resolve, reject) => {

            //     const headers = {
            //         'Authorization': 'Bearer ' + + localStorage.getItem('access-token'),
            //         'Content-Type': 'application/json'
            //     };
            //     this.api.post(`requester/service/${nid}`, data.toString(), headers)
            //         .subscribe(success => {
            //             if (success && success.resultCode == 0) {
            //                 this.packs.set(success.result.idService, data);

            //                 //this.toastr.success('You have been successfully Register your Pack!');
            //                 resolve(success);
            //             }
            //             else reject(success);
            //         }, error => {
            //             reject(error);
            //         });
        });
    }

    acceptPackPrice(pack: Pack, idProvider: String, idTransaction: String) {
        //     this.api.post('requester/service/transaction/valid_price',
        //         {
        //             idService: pack.id,
        //             idProvider,
        //             idTransaction,
        //             price: pack.suggestedPrice
        //         },
        //         {
        //             'Authorization': 'Bearer ' + + localStorage.getItem('access-token'),
        //             'Content-Type': 'application/json'
        //         }
        // );
    }
}
