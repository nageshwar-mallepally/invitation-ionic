import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProblemDetailsPageRoutingModule } from './problem-details-routing.module';

import { ProblemDetailsPage } from './problem-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProblemDetailsPageRoutingModule
  ],
  declarations: [ProblemDetailsPage]
})
export class ProblemDetailsPageModule {}
