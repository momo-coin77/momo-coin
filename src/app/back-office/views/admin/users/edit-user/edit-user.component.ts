import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityID } from '../../../../../shared/entity/EntityID';
import { User, UserAccountState } from '../../../../../shared/entity/user';
import { UserService } from '../../../../../shared/service/user/user.service';


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  id: '';
  user: User = {
    // id:'',
    email: '',
    password: '',
    name: '',
    nicNumber: '', // CNI num
    emailVerified: false,
    phone: '',
    country: '',
    city: '',
    sponsorshipId: '', // id de parrainage
    photoUrl: '',
    network: '',
    user_agree: false,
    status: UserAccountState.DESACTIVE
  }

  constructor(private route: ActivatedRoute,
    private router: Router,
    private userService: UserService) { }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.userService.getUserById(this.id)
      .subscribe((user: User) => this.user = user);
  }

  updateClient(form) {
    if (form.valid) {
      // this.user.id = this.id;
      this.userService.setUser(this.user)
        // .then(() => this.router.navigate(['/']))
        // .catch((err) => console.error(err));
    }
  }
}
