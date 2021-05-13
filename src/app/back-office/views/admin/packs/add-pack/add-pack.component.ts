import { Component, OnInit } from '@angular/core';
import { PackService } from '../../../../../shared/service/pack/pack.service';
import { Router } from '@angular/router';
// import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-pack',
  templateUrl: './add-pack.component.html',
  styleUrls: ['./add-pack.component.css']
})
export class AddPackComponent implements OnInit {

  constructor(
    private packService: PackService,
    private router: Router) { }

  ngOnInit() {
  }

  addPack(form) {
    if (form.valid) {
      this.packService.addPackack(form.value)
        .then(() => this.router.navigate(['/admin/list-pack']))
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
