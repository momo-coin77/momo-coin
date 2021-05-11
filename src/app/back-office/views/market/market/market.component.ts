import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { interval, Subscription } from 'rxjs';
import { Pack } from '../../../../shared/entity/pack';
import { User } from '../../../../shared/entity/user';
import { ResultStatut } from '../../../../shared/service/firebase/resultstatut';
import { MarketService } from '../../../../shared/service/market/market.service';
import { NotificationService } from '../../../../shared/service/notification/notification.service';
import { PackService } from '../../../../shared/service/pack/pack.service';
import { UserService } from '../../../../shared/service/user/user.service';


@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})

export class MarketComponent implements OnInit {
  close: boolean;
  open: boolean;
  hh: number;
  packs: {user:User,pack:Pack}[]=[];
  private updateSubscription: Subscription;
  href: string;
  @ViewChild('secondModal') public secondModal: ModalDirective;
  @ViewChild('firstModal') public firstModal: ModalDirective;

  constructor(private router: Router,
    private modalService: BsModalService,
    // private packService: PackService
    private userService:UserService,
    private marketService:MarketService
    ) {
      this.calculDate();
  }

  ngOnInit() {
    this.updateSubscription = interval(3000).subscribe(
      (val) => {
        this.href = this.router.url;
        let tab = this.href.split('/');
        let d = new Date();
        let hh = d.getMinutes();
        this.hh = hh;
        // console.log(this.hh);
        if (tab[1] === 'market') {
           this.market(this.hh);
        };
      });

      this.marketService.getPackList()
      .subscribe((pack:Pack)=>{
        this.userService.getUserById(pack.idOwner)
        .then((result:ResultStatut)=>{
          this.packs.push({user:result.result,pack})
        })
      })
    // this.packService.packList.subscribe((packages: Map<String, Pack>) => {
    //   this.posts = this.packService.getPackList();
    // });
  }

  market(hh) {
      if(hh == 57 || hh == 59 || hh == 1 || hh == 3){
      this.close = true;
      return this.router.navigate(['market/open']);
    } else {
      this.open = true;
      return this.router.navigate(['market/wait']);
    }
  }

  show2() {
    console.log('teste pop');
    this.secondModal.show();
  }

  show1() {
    console.log('teste modal');
    this.firstModal.show();
  }

  ok() { }

  calculDate(){
  }

  OnDestroy(): void {
    this.open = false;
    this.close = false;
  }

}
