import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewProblemPage } from './new-problem.page';

const routes: Routes = [
  {
    path: '',
    component: NewProblemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewProblemPageRoutingModule {}
