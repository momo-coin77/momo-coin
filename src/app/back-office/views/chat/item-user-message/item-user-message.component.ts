import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../../../shared/entity/user';

@Component({
  selector: 'app-item-user-message',
  templateUrl: './item-user-message.component.html',
  styleUrls: ['./item-user-message.component.css']
})
export class ItemUserMessageComponent implements OnInit {
  @Input() idDiscuss:String;
  @Input() img: String;
  @Input() user:User=new User();
  @Input() online:boolean=false;
  @Input() lastMessage: String;
  @Input() active:boolean=false;
  @Output() selected:EventEmitter<String>=new EventEmitter<String>();
  constructor() { }

  ngOnInit(): void {
  }
  select()
  {
    this.selected.emit(this.idDiscuss);
  }
}
