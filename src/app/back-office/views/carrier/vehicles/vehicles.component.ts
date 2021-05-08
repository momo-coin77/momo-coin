import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Vehicle } from '../../../../shared/entity/vehicle';
import { VehicleService } from '../../../../shared/service/back-office/vehicle.service';
declare var $: any;

@Component({
  templateUrl: 'vehicles.component.html',
  styleUrls: ['vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {
  vehicleForm: FormGroup;
  submitted: boolean;
  listVehicle:Vehicle[]=[];
  
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private vehicleService:VehicleService){

  }

  submit(){
    let p: Vehicle = Vehicle.hydrate(this.vehicleForm.value);
      VehicleService.currentVehicle=p;
      this.submitted=true;
      this.vehicleService.vehicleCreation(p)
      .then((result:any)=>{
        this.submitted=false;
        this.showNotification('top','center', 'success', 'pe-7s-close-circle', '\<b>Success\</b>\<br>Vehicle was added successfully')
        setTimeout(() => {
          this.router.navigate(['/carrier/vehicles'])
        }, 600);
      })
      .catch((error)=>{
        // console.log(error)
        this.showNotification('top','center', 'danger', 'pe-7s-close-circle', '\<b>Sorry\</b>\<br>'+error.message)
        this.submitted=false;
      })

  }

  ngOnInit(): void {
    this.vehicleForm = this.formBuilder.group({
      'field_brand': ['', Validators.required],
      'field_model': ['', Validators.required],
      'field_type': ['', Validators.required],
      'field_numberSeat': ['', Validators.required],
      'field_fieles': ['', Validators.required],
      'field_description': ['', Validators.required],
      'field_photos': ['',],
    });

    this.vehicleService.vehicleSubject.subscribe((vehicleList)=>{
      this.listVehicle=vehicleList
      console.log("Vehicule ",vehicleList)
    });
    this.vehicleService.emitVehicle();
  }


  showNotification(from, align, colortype, icon, text) {

    $.notify({
      icon: icon,
      message: text
    }, {
      type: colortype,
      timer: 1000,
      placement: {
        from: from,
        align: align
      }
    });
  }
}
