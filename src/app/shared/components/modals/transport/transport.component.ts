import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-transport',
  templateUrl: 'transport.component.html',
  styleUrls: ['transport.component.scss']
})
export class TransportComponent {
  message: string = 'this is the notification text.';

  // if it is true, the transport wasn't bigin
  transporStand: boolean = false;
  // if it is true, the transport has bigin
  transportStart: boolean = true;
  // if it is true, the transport is ended
  transportEnd: boolean = false;
  // if it is true, the transport is stoped
  transporStop: boolean = false;

  constructor () {}

  startTransport() {
    // Service start fonction implemented befor next line

    this.transportStart = true;
    this.transporStop = false;
    this.transportEnd = false;
    this.transporStand = false;
  }

  endTransport() {
    // Service end fonction implemented befor next line

    this.transportStart = false;
    this.transporStop = false;
    this.transportEnd = true;
    this.transporStand = false;
  }

  stopTransport() {
    // Service stop fonction implemented befor next line

    this.transportStart = false;
    this.transporStop = true;
    this.transportEnd = false;
    this.transporStand = false;
  }

}
