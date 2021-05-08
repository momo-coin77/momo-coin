import { Entity } from './entity';

export class Address extends Entity 
{
    public email:String="";
    public mobilePhone:String="";
    public phone:String="";
    public websiteLink:String="";
    public whatsAppNumber:String="";
    public skypeNumber:String="";
    public zip:String="";
    public country:String="";
    public city:String="";
} 

export class Zone extends Entity
{
    long:number=0;
    lat:number=0;
    name:String="";
    country:String="";
    city:String="";
    getStringZone():string
    {
        return `${this.city}, ${this.country}`;
    }
}

export class Vehicle extends Entity
{
    type:String="";
    name:String="";
    marque:String="";
    photo:String="";
    getStringVehicle():string
    {
        return `${this.type}:${this.marque}`
    }
}

export class ServiceOfProvider extends Entity
{
    title:String="";
    name:String="";
    description:String="";
    providerId:String="";
    zones:Zone[]=[];
    vehicles:Vehicle[]=[];
    documents:Document[]=[];
    addressForVerification:Address[]=[];

     hydrate(entity:Record<string,any>)
    {
        for(const key in entity)
        {
            if(key=="zones" && entity[key]!=null && entity[key]!=undefined) 
            {
                this.zones=entity[key].map(zone=>{
                    let z:Zone = new Zone();
                    z.hydrate(zone)
                    return z;
                });                
            }
            if(key=="vehicles" && entity[key]!=null && entity[key]!=undefined) 
            {
                this.vehicles=entity[key].map(vehilcle=>{
                    let v:Vehicle = new Vehicle();
                    v.hydrate(vehilcle);
                    return v;
                });
            }
            if(key=="addressForVerification" && entity[key]!=null && entity[key]!=undefined) 
            {
                this.documents=entity[key].map(add=>{
                    let a:Address = new Address();
                    a.hydrate(add);
                    return a;
                });
            }
            if(key=="documents" && entity[key]!=null && entity[key]!=undefined) 
            {
                this.documents=entity[key].map(doc=>{
                    let d:Document = new Document();
                    d.hydrate(doc);
                    return d;
                });
            }
            else Reflect.set(this,key,entity[key]);
        }
    }

    getLocationString():string
    {
        return this.zones.map((zone:Zone)=> `${zone.city}, ${zone.country}`)
        .reduce((previous:string,current:string)=>`${previous}; ${current}`,"")
    }
    getVehiculeString():string
    {
        return this.vehicles.map((vehicle:Vehicle)=> vehicle.getStringVehicle()).reduce((previous:string,current:string)=>`${previous}; ${current}`,"")
    }
}

export class User extends Entity
{
    /**
     * @description nom de l'utilisateur
     * @type String
     */
    public firstname:String="";

    /**
     * @description prenom de l'utilisateur
     * @type String
     */
    public lastname:String="";

    /**
     * @description mot de passe de l'utilisateur
     * @type String
     */
    public password:String="";

    /**
     * @description adresses de l'utilisateur. peut contenir une adresse email, whatsapp,...
     * @type Address
     */
    public adresse:Address=new Address();


    public username:String="";

    hydrate(entity:Record<string,any>)
    {
        for(const key in entity)
        {
            if(key=="address" && entity[key]!=null && entity[key]!=undefined) 
            {
                this.adresse.hydrate(entity[key]);     
            }
            else if(Reflect.has(this,key)) Reflect.set(this,key,entity[key]);
        }
    }
    public getSimpleName():String
    {
        return `${this.firstname} ${this.lastname}`;
    }
    toString():Record<string | number,any>
    {
        let r=super.toString();
        r['address']=this.adresse.toString();
        delete r["adresse"];
        return r;
    }
}

export class Provider extends User
{
    companyName:String="";
    registrationNumber:String="";
    importExportCompagnyCode:String="";    
    isAcceptedProvider:boolean=false;
    companyAddress:String="";
    isProvider:Boolean=false;
    isCompany:boolean=false;
    passportNumber:String="";
}

export class Document extends Entity
{
    name:string="";
    lastModified:string="";
    size:number=0.0;
    type:string="";
    data:any="";
    link:String="";
}