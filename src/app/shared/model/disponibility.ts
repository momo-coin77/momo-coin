export function minTime(time1:string,time2:string):string
{
    let time1Tab=time1.split(":");
    let time2Tab=time2.split(":");
    if(parseInt(time1Tab[0])<parseInt(time2Tab[0])) return time1;
    if(parseInt(time2Tab[0])<parseInt(time1Tab[0])) return time2;
    if(parseInt(time1Tab[1])<parseInt(time2Tab[1])) return time1
    return time2;
}

export function maxTime(time1:string,time2:string):string
{
    let time1Tab=time1.split(":");
    let time2Tab=time2.split(":");
    if(parseInt(time1Tab[0])>parseInt(time2Tab[0])) return time1;
    if(parseInt(time2Tab[0])>parseInt(time1Tab[0])) return time2;
    if(parseInt(time1Tab[1])>parseInt(time2Tab[1])) return time1;
    return time2;
}
export class StatutPeriod{
    static available:boolean=true;
    static unavailable:boolean=false;
};
export class DispoPeriodTime
{   
    startTime:string;
    endTime:string;
    statut:StatutPeriod;
    occupant:string;
    message:string;
    
    constructor(startTime:string='',endTime='',statut:StatutPeriod=StatutPeriod.available,message="") {
        if(!this.isValid(startTime,endTime)) throw Error(`EndTime ${endTime} must be greater than startTime ${startTime}`);
        this.startTime=startTime;
        this.endTime=endTime;
        this.statut=statut;
        this.occupant='';
        this.message=message;
    }
    isValid(startTime:string,endTime:string):boolean
    {
        return DispoPeriodTime.isValidPeriod(startTime,endTime);
    }
    static isValidPeriod(startTime:string,endTime:string):boolean
    {
        let time1=[];
        time1[0]=parseInt(startTime.split(':')[0]);
        time1[1]=parseInt(startTime.split(':')[1]);
        let time2=[];
        time2[0]=parseInt(endTime.split(':')[0]);
        time2[1]=parseInt(endTime.split(':')[1]);
        
        if( (time2[0]>time1[0]) || (time2[0]==time1[0] && time2[1]>time1[1]) ) return true;
        return false;
    }
    static noContains(a:DispoPeriodTime,b:DispoPeriodTime)
    {
        if( (DispoPeriodTime.isValidPeriod(a.startTime, b.startTime) &&
            DispoPeriodTime.isValidPeriod(a.endTime,b.startTime) ) ||
            (DispoPeriodTime.isValidPeriod(b.startTime, a.startTime) &&
            DispoPeriodTime.isValidPeriod(b.endTime,a.startTime))  ) return true;
        return false;
    }
    setOccupant(occupant:string):void
    {
        this.occupant=occupant;
    }
    setMessage(message:string):void
    {
        this.message=message;
    }
    isAvailable():boolean
    {
        return this.statut===StatutPeriod.available;
    }
    setStatut(statut:StatutPeriod):void{
        this.statut=statut;
    }
    toObject():any
    {
        return {
            startTime:this.startTime,
            endTime:this.endTime,
            status:this.statut,
            occupant:this.occupant,
            message:this.message
        }
    }
    static fromObject(obj:any):DispoPeriodTime
    {
        let newPeriod=new DispoPeriodTime(obj.startTime?obj.startTime:'',obj.endTime?obj.endTime:'',obj.statut?obj.status:StatutPeriod.available);
        if(obj.occupant) newPeriod.setOccupant(obj.occupant);
        if(obj.message) newPeriod.setMessage(obj.message);
        return newPeriod;
    }
}

export class DispoPeriodDays
{
    day:number;
    dispoPeriods:DispoPeriodTime[];
    statut:StatutPeriod;
    occupant:string;
    constructor(day:number=1,statut:StatutPeriod=StatutPeriod.available,dispoPeriods:DispoPeriodTime[]=[])
    {
        this.day=day;
        this.statut=statut;
        this.dispoPeriods=dispoPeriods;
        this.occupant='';
    }
    updateStatut():void
    {
        this.statut=StatutPeriod.available;
        let constStartTime="00:00",
            constEndTime="24:59",
            startTime="24:59",
            endTime="00:00";

        this.dispoPeriods.forEach(period=>
        {
            if(period.isAvailable())
            {
                startTime=minTime(startTime,period.startTime);
                endTime=maxTime(endTime,period.endTime);
            }
        });
        if(startTime==constStartTime && endTime==constEndTime) this.statut=StatutPeriod.unavailable;
    }
    isAvailable():boolean
    {
        this.updateStatut();
        return this.statut==StatutPeriod.available;
    }
    setAllStatut(statut:StatutPeriod):void
    {
        for(let period of this.dispoPeriods)
        {
            period.setStatut(status);
        }
    }
    setOccupant(occupant:string):void
    {
        this.occupant=occupant;
    }
    setStatut(statut:StatutPeriod):void{
        this.statut=statut;
        this.setAllStatut(statut);
    }
    toObject():any
    {
        let result={};
        result[this.day]={
            status:this.statut,
            occupant:this.occupant,
            'horaires':[]
        };
        this.dispoPeriods.forEach(time=>{
            result[this.day]['horaires']=[...result[this.day]['horaires'],time.toObject()];
        });
        return result;
    }
    static fromObject(obj:any):DispoPeriodDays
    {
        let dispoTime:DispoPeriodTime[]=[];
        let nd={};
        obj[Object.keys(obj)[0]].horaires.forEach(horaire => {
            let hor=new DispoPeriodTime(horaire.startTime,horaire.endTime,status);
            if(horaire.occupant) hor.setOccupant(horaire.occupant);
            if(horaire.message) hor.setMessage(horaire.message);
            dispoTime.push(hor);
        });
        return new DispoPeriodDays( parseInt(Object.keys(obj)[0]),obj[Object.keys(obj)[0]].status?obj[Object.keys(obj)[0]].status:StatutPeriod.available,dispoTime);   
    }
}


export class DispoPeriodMonth
{
    monthList:string[]=["janvier","fevrier","mars","avril","mai","juin","juillet","aout","septembre","octobre","novembre","decembre"];
    currentMont:string;
    dispo:Record<number,DispoPeriodDays>={};
    constructor(month:string,dispo:Record<number,DispoPeriodDays>={})
    {
        this.currentMont=month;
        this.dispo=dispo;
    }
    toObject():any
    {
        let result={};
        for(let k in this.dispo)
        {
            result[this.currentMont]={...result[this.currentMont],...this.dispo[k].toObject()}
        }
        return result;
    }
    static fromObject(obj):DispoPeriodMonth
    {
        let dispoDay:Record<number,DispoPeriodDays>={};
        for(let dayKey in obj[Object.keys(obj)[0]])
        {
            let ny={};
            ny[dayKey]={...obj[Object.keys(obj)[0]][dayKey]};
            dispoDay[dayKey]=DispoPeriodDays.fromObject(ny);
        }
        return new DispoPeriodMonth( Object.keys(obj)[0],dispoDay);
    }
}


export class DispoPeriodYear
{
    currentYear:number;
    dispo:Record<string,DispoPeriodMonth>={};
    constructor(year:number,dispo:Record<string,DispoPeriodMonth>={})
    {
        this.currentYear=year;
        this.dispo=dispo;
    }
    toObject():any
    {
        let result={};
        result[this.currentYear]={};
        for(let k in this.dispo)
        {
            result[this.currentYear]={...result[this.currentYear],...this.dispo[k].toObject()}
        }
        return result;
    }
    static fromObject(obj:any):DispoPeriodYear
    {
        let dispoMonth:Record<string,DispoPeriodMonth>={};
        for(let monthKey in obj[Object.keys(obj)[0]])
        {
            let ny={};
            ny[monthKey]={...obj[Object.keys(obj)[0]][monthKey]};
            dispoMonth[monthKey]=DispoPeriodMonth.fromObject(ny);
        }
        return new DispoPeriodYear( parseInt(Object.keys(obj)[0]),dispoMonth);
    }
}

export class Disponibilite
{
    dispo:Record<string,DispoPeriodYear>={};
    constructor(dispo:Record<string,DispoPeriodYear>={})
    {
        this.dispo=dispo;
    }
    toObject():any
    {
        let result={ };
        for(let k in this.dispo)
        {
            result={...result,...this.dispo[k].toObject()}
        }
        return {disponibilite:result};
    }
    static fromObject(obj):Disponibilite
    {
        let dispoYear:Record<string,DispoPeriodYear>={};
        for(let yearKey in obj)
        {
            let ny={};
            ny[yearKey]={...obj[yearKey]};
            dispoYear[yearKey]=DispoPeriodYear.fromObject(ny);
        }
        return new Disponibilite(dispoYear);
    }
}