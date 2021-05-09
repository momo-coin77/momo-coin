export class User {
    uid: string;
    email: string;
    // password: string;
    name: string;
    nicNumber: string; // CNI num
    emailVerified: boolean;
    phone: number;
    country: string;
    city: string;
    sponsorshipId: string; // id de parrainage
    status: boolean; // statu du compte ( true pour actif, false pour désactivé )
}
