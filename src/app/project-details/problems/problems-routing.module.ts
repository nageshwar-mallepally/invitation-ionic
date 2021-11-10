import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProblemsPage } from './problems.page';

const routes: Routes = [
  {
    path: '',
    component: ProblemsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProblemsPageRoutingModule {}
