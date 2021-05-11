import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Transaction } from '../../entity/transaction';

@Injectable({
    providedIn: 'root'
})

export class TransactionService {
    transactions: Map<String,Transaction>=new Map<String,Transaction>();
    transactionList:BehaviorSubject<Map<String,Transaction>> = new BehaviorSubject<Map<String,Transaction>>(this.transactions)
    constructor(
    ) { }

    startTransaction(providerId: String, requesterId: String, serviceId: String, initiatorId: String): Promise<any> {
        return new Promise<any>((resolve, reject) => {
        //     this.apiService.post("requester/service/transaction/start", {
        //         "idService": serviceId,
        //         "idProvider": providerId,
        //         "idRequester": requesterId,
        //         "idInitiator": initiatorId
        //     }, this.headers)
        //         .subscribe((result) => {
        //             if (result && result.resultCode == 0) resolve(result);
        //             else reject(result);
        //         }, (error: any) => reject(error));

        })
    }

    getTransactionById(idTransaction:String):Promise<Transaction>
    {
        return new Promise<Transaction>((resolve,reject)=>{
           if(this.transactions.has(idTransaction)) resolve(this.transactions.get(idTransaction));
        })
    }

    addTransaction(transaction:Transaction):void
    {
        // if(this.transactions.has(transaction._id)) return;
        // this.transactions.set(transaction._id,transaction);
        // this.transactionList.next(this.transactions);
    }
    setTransactionFromAPI(data:Record<string, any>)
    {
        data.transactions.forEach(transaction => {
            let trans:Transaction=new Transaction();
            trans.hydrate(transaction);
            this.addTransaction(trans);
        });
    }
}