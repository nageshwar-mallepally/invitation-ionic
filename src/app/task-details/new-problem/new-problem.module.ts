import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewProblemPageRoutingModule } from './new-problem-routing.module';

import { NewProblemPage } from './new-problem.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewProblemPageRoutingModule
  ],
  declarations: [NewProblemPage]
})
export class NewProblemPageModule {}
