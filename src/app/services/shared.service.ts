import { Injectable,OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { LoginService } from '../services/login.service';
import { URLService } from '../services/url.service';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import * as $ from 'jquery';
@Injectable({
    providedIn: 'root'
})
export class SharedService {

    viewInfo = {
        title: null,
        icon: null,
        loginDetails: null,
        personTypeDetails: null,
        personDetails: null,
        invitationId: null,
        projectId: null,
        taskId: null,
        siteId: null,
        showProjectIcons: true,
        showTaskIcons: false,
        showTasksView: true,
        showSiteIcons: false,
        showSitesView: true,
        showProblemsView: true,
        showProblemsIcons: false,
        newProblemType: null,
        problemId: null
    };

    constructor(private router:Router, private loginService:LoginService, private http:HttpClient, private urlservice:URLService) {

    }

    setValue(title, icon) {
        this.viewInfo.title = title;
        this.viewInfo.icon = icon;
    }

    getValue() {
        return this.viewInfo;
    }

    setLoginDetails(loginDetails) {
        this.viewInfo.loginDetails = null;
        this.viewInfo.loginDetails = loginDetails;
    }

    setPersonType(personType) {
        this.viewInfo.personTypeDetails = personType;
    }

    setIrstePerson(personDetails) {
        this.viewInfo.personDetails = personDetails;
    }

    setProjectId(projectId) {
        this.viewInfo.projectId = projectId;
    }

    setSiteId(siteId) {
        this.viewInfo.siteId = siteId;
    }

    setInvitationId(invitationId) {
        this.viewInfo.invitationId = invitationId;
    }

    setTaskId(taskId) {
        this.viewInfo.taskId = taskId;
    }

    setProjectIcons(value) {
        this.viewInfo.showProjectIcons = value;
    }

    setTaskIcons(value) {
        this.viewInfo.showTaskIcons = value;
    }

    setProblemsIcons(value) {
        this.viewInfo.showProblemsIcons = value;
    }

    setTasksView(value) {
        this.viewInfo.showTasksView = value;
    }

    setProblemsView(value) {
        this.viewInfo.showProblemsView = value;
        if (value) {
            this.viewInfo.showProblemsIcons = false;
        } else {
            this.viewInfo.showProblemsIcons = true;
        }
    }

    setSitesView(value) {
        if (value) {
            this.viewInfo.showProjectIcons = false;
        } else {
            this.viewInfo.showProjectIcons = true;
        }
        this.viewInfo.showSitesView = value;
    }

    setNewProblemType(type) {
        this.viewInfo.newProblemType = type;
    }

    setProblemId(value) {
        this.viewInfo.problemId = value;
    }

    showBusyIndicator() {
        var w = $("#app-content").outerWidth();
        var h = $("#app-content").outerHeight();
        $('#busy-indicator').css({top: 0, left: 0, width: w, height: h})
        $('#busy-indicator').show();
    }


    hideBusyIndicator() {
        $('#busy-indicator').hide();
    }
}
