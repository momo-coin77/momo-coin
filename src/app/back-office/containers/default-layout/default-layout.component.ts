import { AfterViewInit, Component, ElementRef, NgModule, NgZone, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../shared/service/user/user.service';
import { navItems } from '../../../_nav';
import { Discussion, Message } from '../../../shared/entity/chat';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '../../../shared/service/notification/notification.service';
import { AuthService } from '../../../shared/service/auth/auth.service';
import { User } from '../../../shared/entity/user';
import { BsModalService, ModalDirective, ModalModule } from 'ngx-bootstrap/modal';
import { Pack } from '../../../shared/entity/pack';
import { UserNotificationService } from '../../../shared/service/user-notification/user-notification.service';
import { BasicPackService } from '../../../shared/service/pack/basic-pack.service';
import { ResultStatut } from '../../../shared/service/firebase/resultstatut';
import { FirebaseApi } from '../../../shared/service/firebase/FirebaseApi';
import { BehaviorSubject } from 'rxjs';
import { ChangeDetectionStrategy } from '@angular/compiler/src/compiler_facade_interface';
// import { NotificationService } from '../../../shared/service/back-office/notification.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit, AfterViewInit {

  @ViewChild('confirmPayment') public confirmPayment: ModalDirective;

  public sidebarMinimized = false;
  public navItems = navItems;
  waitResponse = false;
  selectedPack: Pack = new Pack();
  selectedUser: User = new User();
  selectedMessage: Message = new Message()
  errorFindingPackageMessage = '';
  unreadMessageList: { pack: Pack, message: Message }[] = [];
  public userName: String = '';
  closeResult = '';
  notif: boolean;
  // To have a current year for copirygth
  year: Date = new Date();
  fullName: string = '';
  isAdmin: boolean = false;
  isManager: boolean = false;
  defaultLang="";

  todayTime: number = Date.now();

  @ViewChild('languageSpan') languageSpanShow:ElementRef

  constructor(
    private authService: AuthService, // firebase auth
    private router: Router,
    private bsModal: BsModalService,
    private dashbaord: ElementRef,
    private userService: UserService,
    private userNotif: UserNotificationService,
    private firebaseApi:FirebaseApi,
    private notification: NotificationService,
    private packService: BasicPackService) {
    this.fullName = this.authService.currentUserSubject.getValue().fullName;
    if (this.authService.currentUserSubject.getValue().email == 'admin@gmail.com'){
      this.isAdmin = true;
    };
    if (this.authService.currentUserSubject.getValue().email == 'pundayusufu619@gmail.com'){
      this.isManager = true;
    };
    // this.myfunc();
  }

  ngOnInit(): void {
    this.fullName = this.authService.currentUserSubject.getValue().fullName;
    // this.chatService.listMessageUnreadSubject.subscribe((listMessage) => this.unreadMessageList = listMessage);
    this.authService.currentUserSubject.subscribe((user: User) => {
      if (!user) { return this.userName = user.name; }
    });
    
    this.firebaseApi.handleConnexionState((state:{connected:boolean})=>{
      if(state.connected)
      {
        this.notification.showNotificationWithoutTimer('top', 'right', 'success', 'pe-7s-close-circle', '\<b>Internet connection established !\</b>')
      }
      else this.notification.showNotificationWithoutTimer('top', 'right', 'warning', 'pe-7s-close-circle', '\<b>Internet connection lost !\</b>')
    })

    this.myfunc();
    // this.translate.onLangChange.subscribe((e:LangChangeEvent)=> {
    //   this.defaultLang=e.translations["LANG"][e.lang.toUpperCase()];
    //   // console.log("Default lang ",e.translations["LANG"],e.lang.toUpperCase())
    // })
  }

  ngAfterViewInit(): void {
    let parent = this.dashbaord.nativeElement.querySelectorAll('.navbar-toggler')[2];
    // console.log(parent.childNodes)
    let notifButon = this.dashbaord.nativeElement.querySelector('#notifButton');
    // parent.childNodes.forEach(element => {
    //   parent.removeChild(element);
    // });
    parent.removeChild(parent.querySelector('.navbar-toggler-icon'));
    parent.appendChild(notifButon);
    // console.log("notif",notifButon)
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  confirmMessage() {
    this.waitResponse = true;
    this.packService.confirmPaiementBySeller(this.selectedPack, this.selectedMessage)
    .then((result: ResultStatut) => {
      this.waitResponse = false;
      this.confirmPayment.hide();
      this.notification.showNotification('top', 'center', 'success', 'pe-7s-close-circle', '\<b>Success !\</b>\<br>Your pack has been transferred successfully');
    })
    .catch((error) => {
      this.confirmPayment.hide();
      if(error.apiCode == ResultStatut.INVALID_ARGUMENT_ERROR)
      {
        setTimeout(() => this.notification.showNotification('top', 'center', 'warning', '', '\<b>Sorry !\</b>\<br> This pack is no longer available. You can buy another one',0), 200)
      }
      else setTimeout(() => this.notification.showNotification('top', 'center', 'danger', '', '\<b>Oops!!\</b>An error has occurred <br/>' + error.message,0), 200)
      this.waitResponse = false;
    })
  }
  clearData()
  {
    this.unreadMessageList = [];
  }

  myfunc() {
    this.userNotif.notifications.subscribe((list: Message[]) => {
      // console.log("MEssage ",list)
      // console.log("Notif ",list)
      if (this.unreadMessageList.length > 0) { this.notif = true; }
      else { this.notif = false; }
      let mlist:{ pack: Pack, message:Message }[] = []
      this.unreadMessageList = new Array();

      list.forEach((message: Message) => {
        this.packService
        .getPackById(message.idPack)
        .then((result: ResultStatut) =>  {
          mlist.push({ pack: result.result, message })
          this.unreadMessageList=([]).concat(mlist);
          // console.log('list updata' ,mlist)
        })
      })
      
    });
  }

  logOut() {
    this.authService.signOut();
    this.router.navigate(['/login']);
    this.notification.showNotification('top', 'center', 'success', '', '\<b>You are out !\</b>');
  }
  showModal(info: { pack: Pack, message: Message }) {
    // console.log('teste pop');
    this.confirmPayment.show();
    this.selectedPack = info.pack;
    this.selectedMessage = info.message;
    this.userService.getUserById(this.selectedMessage.from)
      .then((result) => {
        this.selectedUser = result.result;
        this.waitResponse = false;
      })
      .catch((error) => {
        this.confirmPayment.hide();
        // tslint:disable-next-line:max-line-length
        setTimeout(() => this.notification.showNotification('top', 'center', 'danger', '', '\<b>Oops!!\</b>An error has occurred <br/>' + error.message), 200)
        this.waitResponse = false;
      });
  }

  changeLanguage(language)
  {
    // this.translate.use(language)
    // switch (language)
    // {
    //   case 'fr':
    //     this.languageSpanShow.nativeElement.classList.replace("flag-icon-us","flag-icon-fr")
    //     break;
    //   case 'en':
    //     this.languageSpanShow.nativeElement.classList.replace("flag-icon-fr","flag-icon-us")
    //     break
    // }
  }
  refreshFonct(){
    // window.location.reload(true);
    window.location.href = window.location.href,
    window.location.reload(true);
  }
  
}
