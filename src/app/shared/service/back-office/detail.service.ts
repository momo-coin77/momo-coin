
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';


@Injectable({
    providedIn: 'root'
})
export class DetailService {
    posts: any[];

    constructor(
        private toastr: ToastrService,
    ) { }

    getParcelDetail(): Promise<any> {

        return new Promise((resolve, reject) => {
            
        });
    }


    getPassengerDetail(): Promise<any> {

        return new Promise((resolve, reject) => {

        });
    }

    getParcelLocalStorageDetails() {
        const data: any = {
            parcelName: JSON.parse(localStorage.getItem('parcel-detail')).result.parcelName,
            startLocation: JSON.parse(localStorage.getItem('parcel-detail')).result.startLocation,
            endLocation: JSON.parse(localStorage.getItem('parcel-detail')).result.endLocation,
            parcelType: JSON.parse(localStorage.getItem('parcel-detail')).result.parcelType,
            vehicleType: JSON.parse(localStorage.getItem('parcel-detail')).result.vehicleType,
            volume: JSON.parse(localStorage.getItem('parcel-detail')).result.volume,
            isFragile: JSON.parse(localStorage.getItem('parcel-detail')).result.isFragile,
            isUrgent: JSON.parse(localStorage.getItem('parcel-detail')).result.isUrgent,
            collectionDate: JSON.parse(localStorage.getItem('parcel-detail')).result.collectionDate,
            description: JSON.parse(localStorage.getItem('parcel-detail')).result.description,
            price: JSON.parse(localStorage.getItem('parcel-detail')).result.price,

            senderName: JSON.parse(localStorage.getItem('parcel-detail')).result.senderName,
            senderLocatione: JSON.parse(localStorage.getItem('parcel-detail')).result.adresse.senderLocatione,
            senderContact: JSON.parse(localStorage.getItem('parcel-detail')).result.adresse.senderContact,

            receiverName: JSON.parse(localStorage.getItem('parcel-detail')).result.receiverName,
            receiverLocation: JSON.parse(localStorage.getItem('parcel-detail')).result.adresse.receiverLocation,
            receiverContact: JSON.parse(localStorage.getItem('parcel-detail')).result.adresse.receiverContact,
        };
        return data;
    }

    getPassengerLocalStorageDetails() {
        const data: any = {
            passengerName: JSON.parse(localStorage.getItem('passenger-detail')).result.passengerName,
            startLocation: JSON.parse(localStorage.getItem('passenger-detail')).result.startLocation,
            endLocation: JSON.parse(localStorage.getItem('passenger-detail')).result.endLocation,
            numberOfPlace: JSON.parse(localStorage.getItem('passenger-detail')).result.numberOfPlace,
            departureDate: JSON.parse(localStorage.getItem('passenger-detail')).result.collectionDate,
            departureHoure: JSON.parse(localStorage.getItem('passenger-detail')).result.Description,
            price: JSON.parse(localStorage.getItem('passenger-detail')).result.price,
            passengerLocatione: JSON.parse(localStorage.getItem('passenger-detail')).result.adresse.passengerLocatione,
            passengerContact: JSON.parse(localStorage.getItem('passenger-detail')).result.adresse.passengerContact,
        };
        return data;
    }

    // Login into your account
    increase(increase?: string, idRequest?: string, providerId?: string, requesterId?: string): Promise<any> {

        return new Promise((resolve, reject) => {
        });
    }


    setChoice(choice?: boolean, idRequest?: string, providerId?: string, requesterId?: string) {
        return new Promise((resolve, reject) => {

        });

    }

}
