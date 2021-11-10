import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SiteDetailsPageRoutingModule } from './site-details-routing.module';

import { SiteDetailsPage } from './site-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SiteDetailsPageRoutingModule
  ],
  declarations: [SiteDetailsPage]
})
export class SiteDetailsPageModule {}
