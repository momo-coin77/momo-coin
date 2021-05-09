import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Discussion, Message } from '../../entity/chat';
import { ApiService } from '../api/api.service';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    listDiscusion: Discussion[] = [];
    listUnreadMessage: Message[] = [];
    listDiscusionSubject: BehaviorSubject<Discussion[]> = new BehaviorSubject<Discussion[]>([]);
    listMessageUnreadSubject: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);
    headers = {};

    constructor(private api: ApiService,
        ) {
        this.headers = {
            'Authorization': 'Bearer ' + this.api.getAccessToken(),
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        this.getUnReadDiscussion()
            .then((result) => {
                this.listDiscusion = result.map((r) => Discussion.hydrate(r));
                this.listDiscusion.forEach((discuss: Discussion) => {
                    // console.log("Discussion ",discuss)
                    this.listUnreadMessage = this.listUnreadMessage.concat(discuss.chats.filter((msg: Message) => msg.read == 0));
                }
                );
                this.emitDiscussion();
                this.emitUnReadMessage();
            });
    }

    getDiscutionList(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.api.get('chat/list', this.headers)
                .subscribe((success) => {
                    if (success && success.resultCode == 0) {
                        success.result.forEach((disc) => this.listDiscusion.push(Discussion.hydrate(disc)));
                    }
                    else { reject(success); }
                }, (error: any) => reject(error));
        });
    }
    getLocalDiscutionById(idDiscussion: String): Discussion {
        return this.listDiscusion.find((discuss: Discussion) => discuss._id == idDiscussion);
    }
    getUnReadDiscussion(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.api.get('chat/unread', this.headers)
                .subscribe((success) => {
                    if (success && success.resultCode == 0) { resolve(success.result); }
                    else { reject(success); }
                }, (error: any) => reject(error));
        });
    }
    getUnreadMessage() {
        this.listDiscusion.forEach((value: Discussion) => {
            this.listUnreadMessage.concat(value.chats.filter((msg: Message) => msg.read == 0));
        });
        this.emitUnReadMessage();
        // this.listDiscusion.filter((value:Discussion,)=>)
    }
    emitDiscussion() {
        this.listDiscusionSubject.next(this.listDiscusion.slice());
    }
    emitUnReadMessage() {
        this.listMessageUnreadSubject.next(this.listUnreadMessage.slice());
    }
    markAsRead(idMessage: String, idDiscussion: String): Promise<any> {
        return new Promise((resolve, reject) => {
            this.api.post('chat/mark_as_read', { idMessage, idDiscussion }, this.headers)
                .subscribe((success) => {
                    if (success && success.resultCode == 0) { resolve(success); }
                    else { reject(success); }
                }, (error: any) => reject(error));
        });
    }

    newMessage(msg: Message, discussID: String): Promise<any> {
        return new Promise((resolve, reject) => {
            this.api.post('chat/message/add', msg.toString(), this.headers)
                .subscribe((success) => {
                    if (success && success.resultCode == 0) { resolve(success); }
                    else { reject(success); }
                }, (error: any) => reject(error));
        });
    }
}
