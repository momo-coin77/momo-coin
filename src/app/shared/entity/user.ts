import { Entity } from './entity';

export enum UserAccountState {
    ACTIVE = 'active',
    DESACTIVE = 'desactive'
}


export class User extends Entity {
    email: string = '';
    password: string = '';
    name: string = '';
    nicNumber: string = ''; // CNI num
    emailVerified: boolean = false;
    phone: string = '';
    country: string = '';
    city: string = '';
    sponsorshipId: string = ''; // id de parrainage
    status: UserAccountState = UserAccountState.ACTIVE; // statu du compte ( true pour actif, false pour désactivé )
    photoUrl: String = '';
    network: String = '';
    user_agree: boolean = true;
}
