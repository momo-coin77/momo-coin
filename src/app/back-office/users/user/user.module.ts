import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [UserComponent],
  declarations: [UserComponent]
})
export class UserModule { }
