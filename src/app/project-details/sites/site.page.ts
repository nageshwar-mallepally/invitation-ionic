import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { SharedService } from '../../services/shared.service';
import { ProjectService } from '../../services/project.service';
import * as $ from 'jquery';

@Component({
    selector: 'app-site-details',
    templateUrl: './site.page.html',
    styleUrls: ['./site.page.scss'],
})
export class SitePage implements OnInit {
    id:number;
    viewInfo:any;
    sites:any;
    tasks:any;
    resources:any;
    site:any;
    tabName = "details";
    title:any;
    pageable = {
        page: 0,
        size: 10,
        sort: {
            field: "modifiedDate",
            order: "DESC"
        }
    };

    constructor(private ar:ActivatedRoute, private projectService:ProjectService, private sharedService:SharedService) {
        this.viewInfo = this.sharedService.getValue();
        this.id = this.viewInfo.projectId;
    }

    ngOnInit() {
        this.loadSites();
    }


    ionViewWillEnter() {
        this.loadSites();
    }

    sitesView(){
        this.sharedService.setSitesView(true);
    }

    loadSites() {
        this.projectService.getProjectSites(this.id, this.pageable).subscribe(
            (data:any)=> {
                this.sites = data;
            }
        )
    }

    loadSitesNative() {
        this.projectService.getProjectSitesNative(this.id, this.pageable).then(
            (data:any)=> {
                this.sites = JSON.parse(data.data);
            }
        )
    }

    openSite(site) {
        this.title = "Site Details";
        this.sharedService.setSitesView(false);
        let height = $('#app-content').outerHeight();
        let height2 = $('#project-header').outerHeight();
        $('#siteDetails').height(height - (height2 * 3));
        this.loadSiteDetails(site);
        this.viewInfo.showProjectIcons = false;
        this.viewInfo.showTaskIcons = false;
        this.sharedService.setProjectIcons(false);
    }

    loadSiteDetails(site) {
        this.projectService.getSiteDetails(site.id).subscribe(
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

    loadSiteDetailsNative(site) {
        this.projectService.getSiteDetailsNative(site.id).then(
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

    showSiteDetails() {
        this.tabName = "details";
        this.title = "Site Details";
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

    showSiteTasks() {
        this.tabName = "tasks";
        this.title = "Site Tasks";
        this.loadSiteTasks();

    }

    loadSiteTasks() {
        this.projectService.getSiteTasks(this.site.id).subscribe(
            (data:any)=> {
                this.tasks = data;
            }
        )
    }

    loadSiteTasksNative() {
        this.projectService.getSiteTasksNative(this.site.id).then(
            (data:any)=> {
                this.tasks = JSON.parse(data.data);
            }
        )
    }

    showSiteResource() {
        this.tabName = "resources";
        this.title = "Site Resources";
        this.loadSiteResources();

    }

    loadSiteResources(){
        this.projectService.getSiteResources(this.site.id).subscribe(
            (data:any)=> {
                this.resources = data;
            }
        )
    }
    loadSiteResourcesNative(){
        this.projectService.getSiteResourcesNative(this.site.id).then(
            (data:any)=> {
                this.resources = JSON.parse(data.data);
            }
        )
    }

}
