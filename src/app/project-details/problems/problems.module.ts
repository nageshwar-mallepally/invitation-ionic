import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProblemsPageRoutingModule } from './problems-routing.module';

import { ProblemsPage } from './problems.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProblemsPageRoutingModule
  ],
  declarations: [ProblemsPage]
})
export class ProblemsPageModule {}
