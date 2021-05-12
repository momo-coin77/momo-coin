import { Injectable } from "@angular/core";
import { User } from "firebase";
import { BehaviorSubject } from "rxjs";
import { Pack } from "../../entity/pack";

@Injectable({
    providedIn: 'root'
})
export class BasicPackService {
    packs: Map<String, Pack> = new Map<String, Pack>();
    packList: BehaviorSubject<Map<String, Pack>> = new BehaviorSubject<Map<String, Pack>>(this.packs)

    currentUser:User;
}