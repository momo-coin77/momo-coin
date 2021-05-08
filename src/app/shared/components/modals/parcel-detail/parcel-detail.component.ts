import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalModule } from 'angular-bootstrap-md';
import { AlertModule } from 'ngx-bootstrap/alert';
import { DetailService } from '../../../service/back-office/detail.service';

@Component({
  selector: 'app-parcel-detail',
  templateUrl: './parcel-detail.component.html',
  styleUrls: ['./parcel-detail.component.scss']
})

export class ParcelDetailComponent implements OnInit {
  increaseVal: FormGroup;
  @Input() isAnsware: boolean;

  // Parcel datas
  @Input() parcelName: string;
  @Input() startLocation: string;
  @Input() endLocation: string;
  @Input() parcelType: string;
  @Input() vehiculType: string;
  @Input() volume: number;
  @Input() isFragile: boolean;
  @Input() isUrgent: boolean;

  // collectionDate: Date;
  @Input() collectionDate: string;
  @Input() description: string;
  @Input() price: number;

  // Receiver datas
  @Input() receiverName: string;
  @Input() receiverLocation: string;
  @Input() receiverPhone: number;

  // Sender datas
  @Input() senderName: string;
  @Input() senderLocation: string;
  @Input() senderPhone: number;

  constructor(
    public router: Router,
    private formLog: FormBuilder,
    private detailService: DetailService
    ) { }

  ngOnInit(): void {
    this.increaseVal = this.formLog.group({
      'field_increase': ['', ]
    });
  }

  accept() {
    this.isAnsware = true;
    this.detailService.setChoice(true);
  }

  refuse() {
    this.isAnsware = true;
    this.detailService.setChoice(false);
  }

  increase() {
    this.isAnsware = true;
    this.detailService.increase(this.increaseVal.controls.field_increase.value);
  }
}
