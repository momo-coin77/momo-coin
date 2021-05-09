import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../shared/service/user/user.service';
import { navItems } from '../../../_nav';
import { Discussion, Message } from '../../../shared/entity/chat';
import { ChatService } from '../../../shared/service/back-office/chat.service';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Provider } from '../../../shared/entity/provider';
import { NotificationService } from '../../../shared/service/notification/notification.service';
import { Package } from '../../../shared/entity/package';
import { DetailComponent } from '../../../shared/components/modals/detail.component';
import { AuthentificationService } from '../../../shared/service/auth/authentification.service';
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
    private fireAuthService: AuthentificationService, // firebase auth
    private userService: UserService,
    private chatService: ChatService,
    private modalService: NgbModal,
    private router:Router,
    private notification: NotificationService) {
  }

  ngOnInit(): void {
    this.chatService.listMessageUnreadSubject.subscribe((listMessage) => this.unreadMessageList = listMessage);
  }
  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }
  logOut() {
      this.fireAuthService.signOut();
  }

  goToChat(idProjet:string)
  {

    // this.router.navigate([`/package_infos`,idProjet]);
  }

  open(content, message: Message) {
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
    this.modalDetail.show(pkg);
  }

  ConfirmPayment() {
  }

}