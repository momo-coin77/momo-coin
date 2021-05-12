import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../../shared/service/user/user.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '../../../../../shared/service/_helpers/must-match.validator';
// import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  addUserForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userervice: UserService,
    private router: Router) { }

  ngOnInit(): void {
    this.addUserForm = this.formBuilder.group({
      'email': ['', [Validators.required, Validators.email]],
      'field_password': ['', [Validators.required, Validators.minLength(6)]],
      'field_password2': ['', Validators.required],
      'name': ['', Validators.required],
      'nicNumber': ['', Validators.required],
      'emailVerified': [false, Validators.requiredTrue],
      'network': ['', Validators.required],
      'phone': ['', Validators.required],
      'country': ['', Validators.required],
      'city': ['', Validators.required],
      'status': ['', Validators.required],
      'sponsorshipId': ['', Validators.required],
    }, {
      validator: MustMatch('field_password', 'field_password2')
    });
  }


  addUser(form) {
    if (form.valid) {
      this.userervice.addUser(form.value)
        .then(() => this.router.navigate(['/admin/list-user']))
        .catch((error) => console.error(error));
    } else {
      // Swal({
      //   title: 'Form invalid',
      //   text: 'please re-enter your information',
      //   type: 'warning',
      //   showCancelButton: true,
      //   confirmButtonText: 'Continue',
      //   cancelButtonText: 'Cancel'
      // }).then((result) => {
      //   if (result.value) {
      //     Swal(
      //       'Done ! ',
      //     );
      //   } else if (result.dismiss === Swal.DismissReason.cancel) {
      //     Swal(
      //       'Cancelled',
      //     );
      //   }
      // });
      alert('Form invalid !');
    }
  }
}
