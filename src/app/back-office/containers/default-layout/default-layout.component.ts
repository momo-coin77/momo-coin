import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../shared/service/user/user.service';
import { navItems } from '../../../_nav';
import { Discussion, Message } from '../../../shared/entity/chat';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '../../../shared/service/notification/notification.service';
import { AuthService } from '../../../shared/service/auth/auth.service';
import { User } from '../../../shared/entity/user';
// import { NotificationService } from '../../../shared/service/back-office/notification.service';

declare var $: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit {
  public sidebarMinimized = false;
  public navItems = navItems;
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
    private autService: AuthService, // firebase auth
    private router:Router,
    private notification: NotificationService) {
  }

  ngOnInit(): void {
    // this.chatService.listMessageUnreadSubject.subscribe((listMessage) => this.unreadMessageList = listMessage);
    this.autService.currentUserSubject.subscribe((user:User)=>{
      if(!user) return
      this.userName=user.name;
    })
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }
  
  logOut() {
      this.autService.signOut();
      this.router.navigate(['/login']);
      this.notification.showNotification('top', 'center', 'success', '', '\<b>You are out !\</b>');
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
    // this.modalDetail.show(pkg);
  }

  ConfirmPayment() {
  }

}
