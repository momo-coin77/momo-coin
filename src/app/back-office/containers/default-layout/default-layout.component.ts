import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../shared/service/user/user.service';
import { AuthService } from '../../../shared/service/auth/auth.service';
import { navItems } from '../../../_nav';
import { Discussion, Message } from '../../../shared/entity/chat';
import { ChatService } from '../../../shared/service/back-office/chat.service';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PackageService } from '../../../shared/service/back-office/package.service';
import { Provider } from '../../../shared/entity/provider';
import { NotificationService } from '../../../shared/service/notification/notification.service';
import { ChatRealtimeService } from '../../../shared/service/back-office/chat-realtime.service';
import { Package } from '../../../shared/entity/package';
import { DetailComponent } from '../../../shared/components/modals/detail.component';
import { AuthenticationService } from '../../../shared/service/firebase/authentification.service';
// import { NotificationService } from '../../../shared/service/back-office/notification.service';

declare var $: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit {

  @ViewChild("modalDetail") modalDetail:DetailComponent;
  public sidebarMinimized = false;
  public navItems = navItems;
  unreadMessageList: Message[] = [];
  unreadProjetList:Package[] =[];
  waitingPackageInformation = true;
  selectedPackage = null;
  errorFindingPackageMessage = '';
  // tslint:disable-next-line:max-line-length
  public userName: String = '';
  closeResult = '';

  // To have a current year for copirygth
  year: Date = new Date();

  today: number = Date.now();

  constructor (
    private fireAuthService: AuthenticationService, // firebase auth
    private userService: UserService,
    private authService: AuthService,
    private packageService: PackageService,
    private chatService: ChatService,
    private modalService: NgbModal,
    private router:Router,
    private chatRealTimeService:ChatRealtimeService,
    private notification: NotificationService) {
  }

  ngOnInit(): void {
    this.authService.currentUserSubject.subscribe((user: Provider) => {
      this.userName = user.getSimpleName();
    });
    this.chatService.listMessageUnreadSubject.subscribe((listMessage) => this.unreadMessageList = listMessage);
  
    this.chatRealTimeService.getUnreadDiscussion()
    .subscribe((disc:Discussion)=>{
      this.packageService.findPackageById(disc.idProject.toString())
      .then((value:Package)=>this.unreadProjetList.push(value))
    })
  }
  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }
  logOut() {
      this.authService.logOut();
      this.fireAuthService.signOut();
  }

  goToChat(idProjet:string)
  {

    // this.router.navigate([`/package_infos`,idProjet]);
  }

  open(content, message: Message) {
    // console.log("Open modal")
    // this.chatService.markAsRead(message._id,message.idDiscussion)
    // .then((result)=>{
    this.packageService.findPackageById(this.chatService.getLocalDiscutionById(message.idDiscussion).idProject)
      .then((r) => {
        this.waitingPackageInformation = false;
        this.selectedPackage = r;
      }).catch((r) => {
        this.waitingPackageInformation = false;
        this.errorFindingPackageMessage = 'Cannot retreived informations';
      });
    // })

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  showModal(pkg)
  {
    this.modalDetail.show(pkg)
  }

  acceptPrice() {
    // this.notification.showNotification('top','center', 'danger', 'pe-7s-close-circle', '\<b>Sorry\</b>\<br>This service was not available now. Tray later.')

  }

}
