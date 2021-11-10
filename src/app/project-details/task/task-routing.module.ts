import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskPage } from './task.page';
//import { TaskDetailsPageModule } from '../../task-details/task-details.module';
//import { TaskDetailsPage } from '../../task-details/task-details.page';

const routes:Routes = [
    {
        path: '',
        component: TaskPage,
        children: [
            {
                path: "/project/tasks/:id",
                loadChildren: '../../task-details/task-details.module#TaskDetailsPageModule'
            }
        ]
        /*children: [
         {
         path: '',
         children: [
         {
         path: 'details',
         children: [
         {
         path: '',
         loadChildren: '../../task-details/task-basic/task-basic.module#TaskBasicPageModule'
         },
         ]
         },
         {
         path: 'files',
         children: [
         {
         path: '',
         loadChildren: '../../task-details/task-files/task-files.module#TaskFilesPageModule'
         },
         ]
         },
         {
         path: 'media',
         children: [
         {
         path: '',
         loadChildren: '../../task-details/task-media/task-media.module#TaskMediaPageModule'
         },
         ]
         },
         {
         path: 'problems',
         children: [
         {
         path: '',
         loadChildren: '../../task-details/task-problems/task-problems.module#TaskProblemsPageModule'
         },
         ]
         }
         ]
         },
         {
         path: '',
         redirectTo: '/project/:id/tasks/:taskId/details',
         pathMatch: 'full'
         }
         ]*/
    },
    {
        path: '',
        redirectTo: '/project/:id/tasks',
        pathMatch: 'full'
    }
    /*{
     path: 'project/:id/tasks',
     component: TaskPage,
     children: [
     {
     path: ':id/details',
     children: [
     {path: '', loadChildren: '../details/details.module#DetailsPageModule'},
     ]
     },
     {
     path: 'sites',
     children: [
     {path: '', loadChildren: '../sites/site.module#SitePageModule'},
     ]
     },
     {
     path: 'tasks',
     children: [
     {path: '', loadChildren: '../task/task.module#TaskPageModule'},
     ]
     },
     {
     path: 'media',
     children: [
     {path: '', loadChildren: '../media/media.module#MediaPageModule'},
     ]
     },
     {
     path: 'problems',
     children: [
     {path: '', loadChildren: '../problems/problems.module#ProblemsPageModule'},
     ]
     }
     ]
     },
     {
     path: '',
     redirectTo: '/tasks/:id/details',
     pathMatch: 'full'
     }*/
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TaskPageRoutingModule {
}
