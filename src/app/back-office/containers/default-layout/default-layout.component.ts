import { Component, NgModule, NgZone, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../shared/service/user/user.service';
import { navItems } from '../../../_nav';
import { Discussion, Message } from '../../../shared/entity/chat';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '../../../shared/service/notification/notification.service';
import { AuthService } from '../../../shared/service/auth/auth.service';
import { User } from '../../../shared/entity/user';
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal';
import { Pack } from '../../../shared/entity/pack';
import { UserNotificationService } from '../../../shared/service/user-notification/user-notification.service';
// import { NotificationService } from '../../../shared/service/back-office/notification.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit {

  @ViewChild("confirmPayment") public confirmPayment: ModalDirective;

  public sidebarMinimized = false;
  public navItems = navItems;
  waitingPackageInformation = true;
  selectedPackage = null;
  errorFindingPackageMessage = '';
  unreadNotif: Message[] = [];
  // tslint:disable-next-line:max-line-length
  public userName: String = '';
  closeResult = '';

  // To have a current year for copirygth
  year: Date = new Date();

  today: number = Date.now();

  constructor(
    private autService: AuthService, // firebase auth
    private router: Router,
    private userNotif: UserNotificationService,
    private notification: NotificationService) {
  }

  ngOnInit(): void {
    // this.chatService.listMessageUnreadSubject.subscribe((listMessage) => this.unreadMessageList = listMessage);
    this.autService.currentUserSubject.subscribe((user: User) => {
      if (!user) { return this.userName = user.name; }
    });

    this.userNotif.notifications.subscribe((list) => { this.unreadNotif = list});
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  show() {
    console.log('teste pop');
    this.confirmPayment.show();
  }


  logOut() {
    this.autService.signOut();
    this.router.navigate(['/login']);
    this.notification.showNotification('top', 'center', 'success', '', '\<b>You are out !\</b>');
  }

}
