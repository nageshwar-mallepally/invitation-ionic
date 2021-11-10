import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectView1PageRoutingModule } from './project-view1-routing.module';

import { ProjectView1Page } from './project-view1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectView1PageRoutingModule
  ],
  declarations: [ProjectView1Page]
})
export class ProjectView1PageModule {}
