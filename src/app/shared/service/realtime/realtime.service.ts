import { Injectable } from '@angular/core';
import { Provider } from '../../entity/provider';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';
import { EventService } from '../event/event.service';
import { RealTimeErrorType, RealTimeInitErrorType, RealTimeInitMessageType, RealTimeMessage, RealTimeMessageType, UNKNOW_RECEIVER } from './realtime-protocole';

declare var io:any

@Injectable()
export class RealtimeService {
  currentUser:Provider;
  private socketClient:any;
  constructor(private eventService:EventService,    
    private authService:AuthService,
    // private socketClient:Socket,
    private apiService:ApiService) {
      
    this.authService.currentUserSubject.subscribe((userData:Provider)=>{
      this.currentUser=userData;
    })

    this.eventService.logoutEvent.subscribe((value:boolean)=>{
      if(!value) return;
        this.socketClient.emit(RealTimeInitMessageType.LOGOUT,{
          senderID:this.currentUser.id,
          receiverID:UNKNOW_RECEIVER,
          type:RealTimeInitMessageType.LOGOUT
        })
        this.socketClient.on(RealTimeInitMessageType.DISCONNECT,()=>this.socketClient.removeAllListeners())
        this.socketClient.disconnect(true);    
        
    })
    
    let sub=this.eventService.loginEvent.subscribe((value)=>{  
      if(!value) return ;
      this.socketClient=io("http://localhost:8090", {
        
      });
        this.socketClient.on(RealTimeInitMessageType.LOGGIN,this.handleRealtimeLoggin)  
        this.socketClient.emit(RealTimeInitMessageType.LOGGIN,{
          senderID:this.currentUser.id,
          receiverID:UNKNOW_RECEIVER,
          type:RealTimeInitMessageType.LOGGIN,
          data:{
            token:this.apiService.getAccessToken()
          }
        })      
    })
    sub.unsubscribe();
   }

   handleRealtimeLoggin(data:RealTimeMessage){
    if(data.error==RealTimeInitErrorType.SUCCESS )
    {
      this.eventService.loginRealtimeEvent.next(true);
      this.socketClient.off(this.handleRealtimeLoggin)
    }
    
    //|| data.error==RealTimeInitErrorType.USER_ALREADY_EXIST
  }

   addListener(event:RealTimeMessageType,callback:(data:RealTimeMessage)=>void):void
   {
     this.socketClient.on(event.toString(),(data:RealTimeMessage)=>callback(data));
   }
   send(data:RealTimeMessage)
   {
    this.socketClient.emit(data.type.toString(),data);
   }
}
