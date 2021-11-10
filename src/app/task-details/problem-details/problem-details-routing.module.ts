import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProblemDetailsPage } from './problem-details.page';

const routes: Routes = [
  {
    path: '',
    component: ProblemDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProblemDetailsPageRoutingModule {}
