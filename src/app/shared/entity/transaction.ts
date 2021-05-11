import { Entity } from './entity';
import { Pack } from './pack';

export enum TransactionState {
    INIT,
    SERVICE_ACCEPTED_AND_WAITING_PAIEMENT,
    SERVICE_PAIEMENT_DONE_AND_RUNNING,
    SERVICE_DONE_AND_END,
}

export class Transaction extends Entity {
    state: TransactionState;
    idProvider: String = '';
    idRequester: String = '';
    price: String = '';
}
