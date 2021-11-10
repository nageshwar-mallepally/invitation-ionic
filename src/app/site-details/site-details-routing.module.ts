import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SiteDetailsPage } from './site-details.page';

const routes: Routes = [
  {
    path: '',
    component: SiteDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SiteDetailsPageRoutingModule {}
