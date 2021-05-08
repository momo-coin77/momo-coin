import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, OnInit, ViewChild, Input} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { ZoneService } from '../../../shared/service/zone/zone.service';
import { Zone } from '../../../shared/entity/provider';
import { PlaceSummary } from 'wft-geodb-angular-client/lib/model/place-summary.model';
import { GeoDbService } from 'wft-geodb-angular-client';
import { GeoResponse } from 'wft-geodb-angular-client/lib/model/geo-response.model';


@Component({
  selector: 'app-search-location',
  templateUrl: './search-location.component.html',
  styleUrls: ['./search-location.component.css']
})
export class SearchLocationComponent implements OnInit{
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  locationCtrl = new FormControl();
  filteredLocation: Zone[];
  selectedLocation: Zone[] = [];
  allLocations: Zone[] = [];

  @ViewChild('locationInput') locationInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @Input() label:String="Location";
  @Input() placeholder:String="add Location";

  constructor(private geoDbService:GeoDbService) {
    // this.zoneService.zoneSubject.subscribe((zones:Zone[])=>{
    //   this.allLocations=zones;
    // })
    // this.zoneService.emitZone();

    this.locationCtrl.valueChanges.subscribe((city) => {
       this._filter(city);
    });

  }
  ngOnInit(): void {
    
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      // this.selectedLocation.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.locationCtrl.setValue(null);
  }

  remove(location: Zone): void {
    const index = this.selectedLocation.indexOf(location);

    if (index >= 0) {
      this.selectedLocation.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    let strZone=event.option.viewValue;
    let oZone=this.selectedLocation.find((zone:Zone)=>zone.getStringZone().toLowerCase()==strZone.toLowerCase());
    if(oZone==null)
    {
      oZone = this.filteredLocation.find((zone:Zone)=>zone.getStringZone().toLowerCase()==strZone.toLowerCase())
      this.selectedLocation.push(oZone);
    }   
    this.locationInput.nativeElement.value = '';
    this.locationCtrl.setValue(null);
  }

  private _filter(value: string): void{
    this.geoDbService.findPlaces({
      namePrefix: value,
      limit: 10,
      offset: 0
    })
    .subscribe(
      (response: GeoResponse<PlaceSummary[]>) => {
        const totalCount = response.metadata.totalCount;
        this.filteredLocation= response.data.map((place:PlaceSummary)=> {
          let zone:Zone=new Zone();
          zone._id=place.id;
          zone.city=place.city;
          zone.country=place.country;
          zone.lat=place.latitude;
          zone.long=place.longitude;
          zone.name=place.name;
          return zone;
        });
  
        // Do your thing!
      });
  }

}
