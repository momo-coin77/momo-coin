import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TripService } from '../../../../../shared/service/back-office/trip.service';

@Component({
  selector: 'app-post-request-trip0',
  templateUrl: './post-request-trip0.component.html',
  styleUrls: ['./post-request-trip0.component.scss']
})
export class PostRequestTrip0Component implements OnInit {

  submitted: boolean;
  tripForm: FormGroup;
  owner: string = 'Flambel SANOU';
  status: string = 'Draft';
  title = 'New trip request ';
  titleUser: string;
  user1 = true;
  user2 = false;
  user3 = false;
  visible = true;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private tripService: TripService) { }

  ngOnInit(): void {
    this.initPage();
    this.tripForm = this.formBuilder.group({
      'field_status': [this.status, ],
      'field_passengerName': ['', Validators.required],
      'field_price': ['', Validators.required],
      'field_departureDate': ['', Validators.required],
      'field_departureTime': ['', ],
      'field_numberPlace': ['', Validators.required],
      'field_tripDescription': ['', ],
      'field_isUrgent': ['', ]
    });

  }

  pushTripForm() {
    console.log(TripService.currentTrip);
    this.tripService.tripCreation(TripService.currentTrip);
  }


  get f() {
    return this.tripForm.controls;
  }

  // init the user registration
  initPage() {
    if (this.user1) {
      this.titleUser = this.title + '1/3';
      this.visible = true;
    } else if (this.user2) {
      this.titleUser = this.title + '2/3';
      this.visible = true;
    } else if (this.user3) {
      this.titleUser = this.title + '3/3';
      this.visible = false;
    }
  }

  next() {
    if (this.user1) {
      this.user2 = true;
      this.user1 = false;
      this.user3 = false;
    } else if (this.user2) {
      this.user3 = true;
      this.user1 = false;
      this.user2 = false;
    }
    this.initPage();
  }
  

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy(): void {
    TripService.currentTrip.field_price = this.tripForm.controls.field_price?.value;
    TripService.currentTrip.field_time = this.tripForm.controls.field_departureTime?.value;
    TripService.currentTrip.field_numPlace = this.tripForm.controls.field_numberPlace?.value;
    TripService.currentTrip.field_description = this.tripForm.controls.field_tripDescription?.value;
    TripService.currentTrip.field_delayDate = this.tripForm.controls.field_departureDate?.value;

    // console.log(TripService.currentTrip);
    this.pushTripForm();
  }

}
