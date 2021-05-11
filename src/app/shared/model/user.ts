export class User {

    uid: string;
    email: string;
    password: string;
    name: string;
    id: string;
    nicNumber: string; // CNI num
    phone: number;
    country: string;
    city: string;
    sponsorshipId: string; // id de parrainage
    status: boolean; // statu du compte ( true pour actif, false pour désactivé )


    constructor(
        email: string = '',
        password: string = '',
        name: string = '',
        id: string = '',
        // uid: string,
        // nicNumber: string = '',
        // phone: number,
        // country: string = '',
        // city: string = '',
        // sponsorshipId: string = '',
        // status: boolean
        ) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.id = id;
        // this.uid = uid;
        // this.nicNumber = nicNumber;
        // this.phone = phone;
        // this.country = country;
        // this.city = city;
        // this.sponsorshipId = sponsorshipId;
        // this.status = status;
    }


    static fromObject(obj: any): User {
        let newUser = new User(
            obj.email ? obj.email : '',
            obj.password ? obj.password : '',
            obj.name ? obj.name : '',
            obj.id ? obj.id : '',
            // obj.uid ? obj.uid : '',
            // obj.nicNumber ? obj.nicNumber : '',
            // obj.phone ? obj.phone : '',
            // obj.country ? obj.country : '',
            // obj.city ? obj.city : '',
            // obj.sponsorshipId ? obj.sponsorshipId : '',
            // obj.status ? obj.status : '',
        );
        return newUser;
    }

    toObject() {
        let obj = {
            name: this.name,
            email: this.email,
            password: this.password,
            id: this.id,
            uid: this.uid,
            nicNumber: this.nicNumber,
            phone: this.phone,
            country: this.country,
            city: this.city,
            sponsorshipId: this.sponsorshipId,
            status: this.status,
        };
        return { ...obj };
    }
    purgeEmail(): string {
        let reg = /\.|#|,|;|!|\?|\[|\]|$/;
        return this.email.split(reg).join();
    }

}
