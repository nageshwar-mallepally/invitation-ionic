import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes:Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'home', loadChildren: './home/home.module#HomePageModule'},
    {path: 'login', loadChildren: './login/login.module#LoginPageModule'},
    {path: 'invitation/:id', loadChildren: './project/project.module#ProjectPageModule'},
    {path: '', loadChildren: './project-details/project-details.module#ProjectDetailsPageModule'},
    //{path: '', loadChildren: './task-details/task-details.module#TaskDetailsPageModule'},
    {path: 'projectView1/:id', loadChildren: './project-view1/project-view1.module#ProjectView1PageModule'},
    {path: 'projectView1/:id/task', loadChildren: './project-view1/new-task/new-task.module#NewTaskPageModule'},
    {path: 'sites/:id', loadChildren: './site-details/site-details.module#SiteDetailsPageModule'},
    {path: 'tasks/:id', loadChildren: './task-details/task-details.module#TaskDetailsPageModule'},
    {path: 'tasks/:id/problem', loadChildren: './task-details/new-problem/new-problem.module#NewProblemPageModule'},
    {path: 'problems/:id', loadChildren: './task-details/problem-details/problem-details.module#ProblemDetailsPageModule'},
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules, onSameUrlNavigation: 'reload'})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
