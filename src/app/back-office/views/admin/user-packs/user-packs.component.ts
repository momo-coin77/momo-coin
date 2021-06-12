import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { EntityID } from '../../../../shared/entity/EntityID';
import { Pack } from '../../../../shared/entity/pack';
import { User } from '../../../../shared/entity/user';
import { ResultStatut } from '../../../../shared/service/firebase/resultstatut';
import { MarketService } from '../../../../shared/service/market/market.service';
import { UserHistoryService } from '../../../../shared/service/user-history/user-history.service';
import { UserService } from '../../../../shared/service/user/user.service';
import { UserAddPackComponent } from '../user-add-pack/user-add-pack.component';
import { UserTransferPackComponent } from '../user-transfer-pack/user-transfer-pack.component';

@Component({
  selector: 'app-user-packs',
  templateUrl: './user-packs.component.html',
  styleUrls: ['./user-packs.component.css']
})
export class UserPacksComponent implements OnInit,OnChanges {
  @Input() user:User=null;
  userObservable:BehaviorSubject<User>=new BehaviorSubject<User>(null);

  listPurchasedPack:Pack[]=[];
  listPurchasedPackCheck:Map<string,boolean>=new Map<string,boolean>();

  listSalePack:Pack[]=[];
  listSalePackCheck: Map<string, boolean> = new Map<string, boolean>();

  listHistoryPack: Pack[] = [];
  listHistoryPackCheck: Map<string, boolean> = new Map<string, boolean>();
  constructor(private marketService:MarketService,
    private historyService:UserHistoryService,
    private userService:UserService,
    public dialog: BsModalService) { }
  
  ngOnInit(): void {
    this.userObservable.subscribe((user:User)=>{
      if(!user) return;
      this.listPurchasedPack = new Array(),
      this.listPurchasedPackCheck.clear();
      this.marketService.getUserOrderdPackNotInMarket(user.id).forEach((pack:Pack)=>{
        if (!this.listPurchasedPackCheck.has(pack.id.toString().toString())) {
          this.listPurchasedPackCheck.set(pack.id.toString().toString(), true);
          this.listPurchasedPack.push(pack);
        }
      })

      this.listSalePack = new Array(),
      this.listSalePackCheck.clear();
      this.marketService.getUserOrderedPackOnMarket(user.id).forEach((pack: Pack) => {
        if (!this.listSalePackCheck.has(pack.id.toString().toString())) {
          this.listSalePackCheck.set(pack.id.toString().toString(), true);
          this.listSalePack.push(pack);
        }
      });

      this.listHistoryPack = new Array(),
      this.historyService.getUserPackHistory(user.id)
      .then((result:ResultStatut)=> this.listHistoryPack = result.result)
    })
  }
  getFormatDate(date:string):string
  {
    return new Date(date).toLocaleDateString()
  }
  getFormatHours(date:string):string
  {
    if(date=="") return date;
    let stringDate="";
    try
    {
      let d=new Date(date)
      if(d.getHours()<10) stringDate=`0${d.getHours()}H:`;
      else stringDate=`${d.getHours()}H:`;

      if(d.getMinutes()<10) stringDate+=`0${d.getMinutes()} Min`;
      else stringDate+=`${d.getMinutes()} Min`;
    }
    catch(err)
    {
      console.log(err)
    }
    
    return stringDate;
  }
  getBuyer(id:EntityID)
  {
    if(this.userService.listUser.has(id.toString())) return this.userService.listUser.get(id.toString()).email
    return ""
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.user && changes.user.currentValue!=null)
    {
      this.userObservable.next(this.user);
    }
  }
  tranferPack(pack:Pack)
  {
    this.dialog.show(UserTransferPackComponent,
      {
        initialState:{
          user:this.user,
          pack
        }
      }
      )
  }
  openDialog()
  {
    const dialogRef = this.dialog.show(UserAddPackComponent,{
      initialState:{
        user:this.user
      }
    });
  }

}
