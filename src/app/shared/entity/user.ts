import { Entity } from "./entity";

export class User extends Entity {
    uid: string;
    email: string;
    password: string;
    name: string;
    nicNumber: string; // CNI num
    emailVerified: boolean;
    phone: number;
    country: string;
    city: string;
    sponsorshipId: string; // id de parrainage
    status: boolean; // statu du compte ( true pour actif, false pour désactivé )
}
