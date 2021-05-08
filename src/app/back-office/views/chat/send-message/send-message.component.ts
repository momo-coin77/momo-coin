import { Component, OnInit, Input } from '@angular/core';
import { DiscussionMessage } from '../chat/chat.component';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.css']
})
export class SendMessageComponent implements OnInit {
  @Input() message:DiscussionMessage;
  constructor() { }

  ngOnInit(): void {
  }

}
