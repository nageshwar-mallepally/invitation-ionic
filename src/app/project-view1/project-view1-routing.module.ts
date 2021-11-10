import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectView1Page } from './project-view1.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectView1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectView1PageRoutingModule {}
