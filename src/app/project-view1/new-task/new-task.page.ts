import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { SharedService } from '../../services/shared.service';
import { ProjectService } from '../../services/project.service';
import * as $ from 'jquery';
import * as moment from 'moment-timezone';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import {DatePipe} from '@angular/common';
@Component({
    selector: 'app-new-task',
    templateUrl: './new-task.page.html',
    styleUrls: ['./new-task.page.scss'],
})
export class NewTaskPage implements OnInit {
    momentJs:any = moment;
    projectId:any;
    newTask = {
        id: null,
        name: null,
        description: null,
        project: null,
        plannedStartDate: null,
        plannedFinishDate: null,
        status: "NEW",
        wbsItem: null,
        wbsItemObject: null,
        site: null,
        siteObject: null,
        person: null,
        personObject: null,
        unitOfWork: null,
        totalUnits: null,
        inspectedBy: null,
        inspectedByObject: null,
        subContract: false,
        workflow: null,
        wfStatus: null,
        percentComplete: 0.0
    };

    newSite = {
        id: null,
        name: null,
        description: null,
        project: null
    }

    projectPersons:any;
    projectSites = [];

    constructor(private backNav:Location, private projectService:ProjectService,
                private sharedService:SharedService, private datePicker:DatePicker, private datePipe:DatePipe) {
        this.projectId = this.sharedService.getValue().projectId;
    }

    ngOnInit() {
        this.sharedService.showBusyIndicator();
        this.loadProjectTeam();
        this.loadSites();
        this.loadWBS();
        let height = $('#app-content').outerHeight();
        let height1 = $('#task-heading').outerHeight();
        $('#task-content').height(height - (height1));
    }

    back() {
        this.backNav.back();
    }

    loadProjectTeam() {
        this.projectService.getProjectTeam(this.projectId).subscribe(
            (data:any)=> {
                this.projectPersons = data;
                this.sharedService.hideBusyIndicator();
            }
        )
    }

    loadProjectTeamNative() {
        this.projectService.getProjectTeamNative(this.projectId).then(
            (data:any)=> {
                this.projectPersons = JSON.parse(data.data);
                this.loadSitesNative();
            }
        )
    }

    loadSites() {
        this.projectService.getSitesByProject(this.projectId).subscribe(
            (data:any)=> {
                let newSite = {
                    id: null,
                    name: "New Site"
                }
                this.projectSites = data;
                this.projectSites.splice(0, 0, newSite);
                this.sharedService.hideBusyIndicator();
            }
        )
    }

    loadSitesNative() {
        this.projectService.getSitesByProjectNative(this.projectId).then(
            (data:any)=> {
                this.projectSites = JSON.parse(data.data);
                let newSite = {
                    id: null,
                    name: "New Site"
                }
                this.projectSites = data;
                this.projectSites.splice(0, 0, newSite);
                this.loadWBSNative();
            }
        )
    }

    projectWbs = [];

    loadWBS() {
        this.projectService.getProjectWbs(this.projectId).subscribe(
            (data:any)=> {
                for (let i = 0; i < data.length; i++) {
                    let wbs = data[i];
                    if (wbs.children.length == 0) {
                        this.projectWbs.push(wbs);
                    }
                }
                setTimeout(()=> {
                    this.sharedService.hideBusyIndicator();
                }, 500)
            }
        )
    }

    loadWBSNative() {
        this.projectService.getProjectWbsNative(this.projectId).then(
            (data:any)=> {
                let projectWbs = JSON.parse(data.data);
                for (let i = 0; i < projectWbs.length; i++) {
                    let wbs = projectWbs[i];
                    if (wbs.children.length == 0) {
                        this.projectWbs.push(wbs);
                    }
                }
                this.sharedService.hideBusyIndicator();
            }
        )
    }

    createTask() {
        if (this.validateTask()) {
            this.sharedService.showBusyIndicator();
            this.newTask.wbsItem = this.newTask.wbsItemObject.id;
            this.newTask.person = this.newTask.personObject.id;
            this.newTask.project = this.projectId;
            if (this.newTask.inspectedByObject != null) {
                this.newTask.inspectedBy = this.newTask.inspectedByObject.id;
            }

            if (this.newTask.siteObject.id == null && this.newTask.siteObject.name == "New Site") {
                this.newSite.project = this.projectId;
                this.projectService.createSite(this.newSite).subscribe(
                    (data:any)=> {
                        this.newTask.site = data.id;
                        this.projectService.createTask(this.projectId, this.newTask).subscribe(
                            (data:any)=> {
                                this.back();
                                this.sharedService.hideBusyIndicator();
                                alert("Task created successfully");
                            }, (error:any)=> {
                                this.sharedService.hideBusyIndicator();
                                alert(error.error.message);
                            }
                        )
                    }, (error)=> {
                        this.sharedService.hideBusyIndicator();
                        alert(error.error.message);
                    }
                )
            } else {
                this.newTask.site = this.newTask.siteObject.id;
                this.projectService.createTask(this.projectId, this.newTask).subscribe(
                    (data:any)=> {
                        this.back();
                        this.sharedService.hideBusyIndicator();
                        alert("Task created successfully");
                    }, (error:any)=> {
                        this.sharedService.hideBusyIndicator();
                        alert(error.error.message);
                    }
                )
            }


        }
    }

    createTaskNative() {
        if (this.validateTask()) {
            this.sharedService.showBusyIndicator();
            this.newTask.wbsItem = this.newTask.wbsItemObject.id;
            this.newTask.person = this.newTask.personObject.id;
            this.newTask.project = this.projectId;
            if (this.newTask.inspectedByObject != null) {
                this.newTask.inspectedBy = this.newTask.inspectedByObject.id;
            }

            if (this.newTask.siteObject.id == null && this.newTask.siteObject.name == "New Site") {
                this.newSite.project = this.projectId;
                this.projectService.createSiteNative(this.newSite).then(
                    (data:any)=> {
                        this.newTask.site = JSON.parse(data.data.id);
                        this.projectService.createTaskNative(this.projectId, this.newTask).then(
                            (data:any)=> {
                                this.back();
                                this.sharedService.hideBusyIndicator();
                                alert("Task created successfully");
                            }, (error:any)=> {
                                this.sharedService.hideBusyIndicator();
                                alert(error.error.message);
                            }
                        )
                    }, (error)=> {
                        this.sharedService.hideBusyIndicator();
                        alert(error.error.message);
                    }
                )
            } else {
                this.newTask.site = this.newTask.siteObject.id;
                this.projectService.createTaskNative(this.projectId, this.newTask).then(
                    (data:any)=> {
                        this.back();
                        this.sharedService.hideBusyIndicator();
                        alert("Task created successfully");
                    }, (error:any)=> {
                        this.sharedService.hideBusyIndicator();
                        alert(error.error.message);
                    }
                )
            }


        }
    }

    hasError = false;
    errorMessage = "";

    validateTask() {
        let valid = true;
        if (this.newTask.name == null || this.newTask.name == undefined || this.newTask.name == "") {
            valid = false;
            alert("Task Name cannot be empty");
        } else if (this.newTask.siteObject == null || this.newTask.siteObject == undefined || this.newTask.siteObject == "") {
            valid = false;
            alert("Please select Site");
        } else if (this.newTask.siteObject != null && !this.validSite()) {
            valid = false;
        } else if (this.newTask.wbsItemObject == null || this.newTask.wbsItemObject == undefined || this.newTask.wbsItemObject == "") {
            valid = false;
            alert("Please select WBS");
        } else if (this.newTask.unitOfWork == null || this.newTask.unitOfWork == undefined || this.newTask.unitOfWork == "") {
            valid = false;
            alert("Please enter Unit of work");
        } else if (this.newTask.totalUnits == null || this.newTask.totalUnits == undefined || this.newTask.totalUnits == "") {
            valid = false;
            alert("Please enter Total Units");
        } else if (this.newTask.plannedStartDate == null || this.newTask.plannedStartDate == undefined || this.newTask.plannedStartDate == "") {
            valid = false;
            alert("Please select Planned Start Date");
        } else if (this.newTask.plannedStartDate != null) {

            var plannedStartDate = moment(this.newTask.plannedStartDate, 'DD/MM/YYYY');
            var wbsPlannedStartDate = moment(this.newTask.wbsItemObject.plannedStartDate, 'DD/MM/YYYY');
            var taskWbsPlannedFinishDate = moment(this.newTask.wbsItemObject.plannedFinishDate, 'DD/MM/YYYY');
            if (plannedStartDate.isBefore(wbsPlannedStartDate)) {
                valid = false;
                alert("Planned Start Date should be in b/w WBS Planned Start & Finished Date's");
            } else if (plannedStartDate.isAfter(taskWbsPlannedFinishDate)) {
                valid = false;
                alert("Planned Start Date should be before WBS Planned Finished Date");
            } else if (this.newTask.plannedFinishDate == null || this.newTask.plannedFinishDate == undefined || this.newTask.plannedFinishDate == "") {
                valid = false;
                alert("Please select Planned Finish Date");
            } else if (this.newTask.plannedFinishDate != null) {
                var plannedFinishDate = moment(this.newTask.plannedFinishDate, 'DD/MM/YYYY');
                var plannedStartDate = moment(this.newTask.plannedStartDate, 'DD/MM/YYYY');
                var wbsPlannedFinishDate = moment(this.newTask.wbsItemObject.plannedFinishDate, 'DD/MM/YYYY');
                var val = plannedFinishDate.isSame(plannedStartDate) || plannedFinishDate.isAfter(plannedStartDate);
                if (!val) {
                    valid = false;
                    alert("Planned Start Date should be before Planned Finish Date");
                } else if (plannedFinishDate.isAfter(wbsPlannedFinishDate)) {
                    valid = false;
                    alert("Planned Finish Date should not exceed WBS Planned Finish Date");
                }
            }
        }

        return valid;
    }

    validSite() {
        let valid = true;
        if (this.newTask.siteObject.name == "New Site" && this.newTask.siteObject.id == null && (this.newSite.name == "" || this.newSite.name == null)) {
            valid = false;
            alert("Please enter Site Name");
        }

        return valid;
    }


    selectPlannedStartDate() {
        this.datePicker.show({
            date: new Date(),
            mode: 'date',
            androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
        }).then(
            (date) => {
                this.newTask.plannedStartDate = this.datePipe.transform(date, "dd/MM/yyyy");
                alert('Got date: ' + date);
            },
            (err) => {
                console.log('Error occurred while getting date: ', err)
            }
        )
        ;
    }

    selectPlannedFinishDate() {
        this.datePicker.show({
            date: new Date(),
            mode: 'date',
            androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
        }).then(
            (date) => {
                this.newTask.plannedFinishDate = this.datePipe.transform(date, "dd/MM/yyyy");
                alert('Got date: ' + date);
            },
            (err) => {
                console.log('Error occurred while getting date: ', err)
            }
        )
        ;
    }

    selectWbs() {
        this.newTask.plannedStartDate = this.newTask.wbsItemObject.plannedStartDate;
        this.newTask.plannedFinishDate = this.newTask.wbsItemObject.plannedFinishDate;
    }

    showNewSiteView = false;

    convertStartDate() {
        this.newTask.plannedStartDate = this.datePipe.transform(this.newTask.plannedStartDate, "dd/MM/yyyy");
    }

    selectSite() {
        if (this.newTask.siteObject.id == null && this.newTask.siteObject.name == "New Site") {
            this.showNewSiteView = true;
        } else {
            this.showNewSiteView = false;
        }
    }
}
