import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { SharedService } from '../services/shared.service';
import { ProjectService } from '../services/project.service';
import * as $ from 'jquery';
import { Location } from "@angular/common";
@Component({
    selector: 'app-site-details',
    templateUrl: './site-details.page.html',
    styleUrls: ['./site-details.page.scss'],
})
export class SiteDetailsPage implements OnInit {
    viewInfo:any;
    id:any;
    siteTabName = "site-details";

    constructor(private router:Router, private ar:ActivatedRoute, private projectService:ProjectService, private sharedService:SharedService, private backNav:Location) {
        this.viewInfo = this.sharedService.getValue();
        this.id = this.viewInfo.siteId;
    }

    ngOnInit() {
        this.loadSite();
        let height = $('#app-content').outerHeight();
        let height1 = $('#siteDetails-heading').outerHeight();
        $('#siteDetails-content').height(height - (height1));
    }

    ionViewWillEnter() {
        if (this.siteTabName == "site-details") {
            this.loadSite();
        } else if (this.siteTabName == "site-tasks") {
            this.loadSiteTasks();
        } else if (this.siteTabName == "site-resources") {
            this.loadSiteResources();
        }
    }

    site:any;
    callToNumber(number){
        setTimeout(() => {
            let tel = number;
            window.open(`tel:${tel}`, '_system');
        },100);
    }
    loadSite() {
        this.projectService.getSiteDetails(this.id).subscribe(
            (data:any)=> {
                this.site = data;
                setTimeout(()=> {
                    let progress = document.getElementById("site" + this.site.id);
                    if (progress != null) {
                        if (this.site.totalTasks == 0) {
                            progress.style.width = 0 + "%";
                        } else {
                            progress.style.width = (this.site.finishedTasks / this.site.totalTasks * 100) + "%";
                        }
                    }
                }, 100)
            }
        )
    }

    loadSiteNative() {
        this.projectService.getSiteDetailsNative(this.id).then(
            (data:any)=> {
                this.site = JSON.parse(data.data);
                setTimeout(()=> {
                    let progress = document.getElementById("site" + this.site.id);
                    if (progress != null) {
                        if (this.site.totalTasks == 0) {
                            progress.style.width = 0 + "%";
                        } else {
                            progress.style.width = (this.site.finishedTasks / this.site.totalTasks * 100) + "%";
                        }
                    }
                }, 100)
            }
        )
    }

    back() {
        this.backNav.back();
    }

    selectSiteTab(tab) {
        if (tab == "site-details") {
            this.loadSite();
        } else if (tab == "site-tasks") {
            this.loadSiteTasks();
        } else if (tab == "site-resources") {
            this.loadSiteResources();
        }
        this.siteTabName = tab;
        let object = document.getElementById(tab);
        object.style.background = "#e4d6d6";
        setTimeout(()=> {
            object.style.background = "#178e17";
        }, 100)
    }

    tasks:any;
    resources:any;

    loadSiteTasks() {
        this.projectService.getSiteTasks(this.site.id).subscribe(
            (data:any)=> {
                this.tasks = data;
                setTimeout(()=> {
                    for (let i = 0; i < this.tasks.length; i++) {
                        let ipAddress = this.tasks[i];
                        let progress = document.getElementById("siteTasks" + ipAddress.task.id);
                        if (progress != null) {
                            progress.style.width = ipAddress.task.percentComplete + "%";
                        }
                    }
                }, 100)
            }
        )
    }

    loadSiteTasksNative() {
        this.projectService.getSiteTasksNative(this.site.id).then(
            (data:any)=> {
                this.tasks = JSON.parse(data.data);
                setTimeout(()=> {
                    for (let i = 0; i < this.tasks.length; i++) {
                        let ipAddress = this.tasks[i];
                        let progress = document.getElementById("siteTasks" + ipAddress.task.id);
                        if (progress != null) {
                            progress.style.width = ipAddress.task.percentComplete + "%";
                        }
                    }
                }, 100)
            }
        )
    }

    loadSiteResources() {
        this.projectService.getSiteResources(this.site.id).subscribe(
            (data:any)=> {
                this.resources = data;
            }
        )
    }

    loadSiteResourcesNative() {
        this.projectService.getSiteResourcesNative(this.site.id).then(
            (data:any)=> {
                this.resources = JSON.parse(data.data);
            }
        )
    }

    openTask(task) {
        this.sharedService.setTaskId(task.id);
        this.router.navigate(['tasks/' + task.id]);
    }
}
