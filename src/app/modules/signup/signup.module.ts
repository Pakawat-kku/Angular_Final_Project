import { SignupRoutingModule } from './signup-routing.module';
import { SignupPageComponent } from './signup-page/signup-page.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'ng2-select';



@NgModule({
  declarations: [
    SignupPageComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    SignupRoutingModule,
    ClarityModule,
    SelectModule
  ]
})
export class SignupModule { }
