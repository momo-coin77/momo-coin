import { Component, OnInit, Input } from '@angular/core';
import { DiscussionMessage } from '../chat/chat.component';

@Component({
  selector: 'app-received-message',
  templateUrl: './received-message.component.html',
  styleUrls: ['./received-message.component.css']
})
export class ReceivedMessageComponent implements OnInit {
  @Input() message:DiscussionMessage;
  constructor() { }

  ngOnInit(): void {
  }

}
