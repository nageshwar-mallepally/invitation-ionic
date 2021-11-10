import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectDetailsPageRoutingModule } from './project-details-routing.module';

import { ProjectDetailsPage } from './project-details.page';
import { TaskDetailsPageModule } from '../task-details/task-details.module';
import {
    RoundProgressModule
} from 'angular-svg-round-progressbar';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ProjectDetailsPageRoutingModule,
        RoundProgressModule,
        TaskDetailsPageModule
    ],
    declarations: [ProjectDetailsPage],
    providers: []
})

export class ProjectDetailsPageModule {
}
