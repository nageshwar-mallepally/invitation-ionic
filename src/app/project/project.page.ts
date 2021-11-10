import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { ProjectService } from '../services/project.service';
import { SharedService } from '../services/shared.service';
import { Contacts, ContactFieldType, ContactFindOptions } from 'ionic-native';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import * as $ from 'jquery';
import { Location } from "@angular/common";
@Component({
    selector: 'app-project',
    templateUrl: './project.page.html',
    styleUrls: ['./project.page.scss'],
})
export class ProjectPage implements OnInit {

    projects:any;
    viewInfo:any;

    constructor(private router:Router, private projectService:ProjectService, private sharedService:SharedService, private backNav:Location/*,
     private contacts:Contacts, private contactFieldType:ContactFieldType, private contactFindOptions:ContactFindOptions*/) {
        this.viewInfo = this.sharedService.getValue();
    }

    ngOnInit() {
        this.sharedService.showBusyIndicator();
        this.loadProjects();
        let height = $('#app-content').outerHeight();
        let width = $('#app-content').outerWidth();
        let height1 = $('#projects-heading').outerHeight();
        let backButton = $('#back-button').outerWidth();
        $('#projects-content').height(height - (height1));
        $('#heading').width(width - (backButton));
    }

    back() {
        this.backNav.back();
    }

    loadProjectsNative() {
        this.projectService.getPortfolioProjectsNative(this.viewInfo.portfolioId).then(
            (data:any)=> {
                this.projects = JSON.parse(data.data);
                setTimeout(()=> {
                    for (let i = 0; i < this.projects.length; i++) {
                        let ipAddress = this.projects[i];
                        let progress = document.getElementById(ipAddress.id);
                        if (progress != null) {
                            progress.style.width = ipAddress.percentComplete + "%";
                        }
                    }
                    this.sharedService.hideBusyIndicator();
                }, 100)
            }
        )
    }

    invitation:any;

    loadProjects() {
        this.projectService.getInvitationDetails(this.viewInfo.invitationId).subscribe(
            (data:any)=> {
                this.invitation = data;
                this.sharedService.hideBusyIndicator();
            }, (error:any)=> {
                this.sharedService.hideBusyIndicator();
            }
        )
    }

    loadProjectsByPerson() {
        this.projectService.getProjectsByPerson(this.viewInfo.loginDetails.person.id).subscribe(
            (data:any)=> {
                this.projects = data;
                setTimeout(()=> {
                    for (let i = 0; i < this.projects.length; i++) {
                        let ipAddress = this.projects[i];
                        let progress = document.getElementById(ipAddress.id);
                        if (progress != null) {
                            progress.style.width = ipAddress.percentComplete + "%";
                        }
                    }
                    this.sharedService.hideBusyIndicator();
                }, 100)
            }
        )
    }

    sendEmailTo(email) {

    }

    allContacts:any;
    showContacts = false;

    getContacts() {

        /* Contacts.find(['displayName', 'name', 'phoneNumbers', 'emails'], {filter: "", multiple: true})
         .then(data => {
         this.allContacts = data;
         this.showContacts = true;
         });*/

    }


    callToNumber(number) {
        setTimeout(() => {
            let tel = number;
            window.open(`tel:${tel}`, '_system');
        }, 100);
    }

    openProject(project) {
        this.sharedService.setProjectId(project.id);
        this.router.navigate(['project/' + project.id + "/details"]);
    }

    openProjectView1(project) {
        this.sharedService.setProjectId(project.id);
        this.router.navigate(['projectView1/' + project.id]);
    }

    openProjectView2(project) {
        this.sharedService.setProjectId(project.id);
        this.router.navigate(['projectView2/' + project.id + "/details"]);
    }
}
