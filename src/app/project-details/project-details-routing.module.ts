import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectDetailsPage } from './project-details.page';
import { TaskPage } from './task/task.page';

/*const routes: Routes = [
 {
 path: '',
 component: ProjectDetailsPage
 }
 ];*/

const routes:Routes = [
    {
        path: 'project/:id',
        component: ProjectDetailsPage,
        children: [
            {
                path: 'details',
                children: [
                    {path: '', loadChildren: './details/details.module#DetailsPageModule'},
                ]
            },
            {
                path: 'sites',
                children: [
                    {path: '', loadChildren: './sites/site.module#SitePageModule'},
                ]
            },
            {
                path: 'tasks',
                children: [
                    {path: '', loadChildren: './task/task.module#TaskPageModule'},
                ]
            },
            {
                path: 'media',
                children: [
                    {path: '', loadChildren: './media/media.module#MediaPageModule'},
                ]
            },
            {
                path: 'problems',
                children: [
                    {path: '', loadChildren: './problems/problems.module#ProblemsPageModule'},
                ]
            }
        ]
    },
    {
        path: '',
        redirectTo: '/project/:id/details',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ProjectDetailsPageRoutingModule {
}
