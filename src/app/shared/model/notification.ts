export class NotificationStatut
{
    static read:boolean=true;
    static unread:boolean=false;
}

export class Notification
{
    senderEmail:string;
    receiverEmail:string;
    content:any="";
    disponibilite:any[];
    is_read:NotificationStatut;
    constructor(sender:string='',receiver:string='',content="",read:NotificationStatut=NotificationStatut.unread)
    {
        this.senderEmail=sender;
        this.receiverEmail=receiver;
        this.content=content;
        this.is_read=read;
    }
    setRead(read:NotificationStatut=NotificationStatut.read)
    {
        this.is_read=read;
    }
    static fromObject(obj)
    {
        let sender=obj.senderEmail?obj.senderEmail:'';
        let receiver=obj.receiver?obj.receiver:'';
        let content=obj.content?obj.content:"";
        let is_read=obj.is_read?obj.is_read:NotificationStatut.unread;
        return new Notification(sender,receiver,content,is_read);
    }
    toObject()
    {
        return {
            senderEmail:this.senderEmail,
            receiverEmail:this.receiverEmail,
            content:this.content,
            is_read:this.is_read
        };
    }
}