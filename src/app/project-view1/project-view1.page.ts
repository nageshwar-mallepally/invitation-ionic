import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { SharedService } from '../services/shared.service';
import { ProjectService } from '../services/project.service';
import { URLService } from '../services/url.service';
import { Location } from "@angular/common";
import * as $ from 'jquery';
import { LoadingController } from '@ionic/angular';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import {File, IWriteOptions, FileEntry} from '@ionic-native/file/ngx';
import 'hammerjs';
/*import { Chart } from 'chart.js';
 import 'chartjs-plugin-labels';*/

@Component({
    selector: 'app-project-view1',
    templateUrl: './project-view1.page.html',
    styleUrls: ['./project-view1.page.scss'],
})
export class ProjectView1Page implements OnInit {
    id:number;
    viewInfo:any;
    project:any;
    title:any;
    applicationUrl:any;
    commentsView = false;

    constructor(private router:Router, private ar:ActivatedRoute, private projectService:ProjectService, private sharedService:SharedService,
                private urlService:URLService, private location:Location, public loader:LoadingController, private fileChooser:FileChooser,
                private filePath:FilePath, private file:File) {
        this.viewInfo = this.sharedService.getValue();
        this.id = this.viewInfo.projectId;
        this.applicationUrl = this.urlService.viewInfo.restUrl;
    }

    tabNameMap = new Map();
    tabNumberMap = new Map();

    ngOnInit() {
        this.sharedService.showBusyIndicator();
        this.loadProject();
        let height = $('#app-content').outerHeight();
        let height1 = $('#details-heading').outerHeight();
        let height2 = $('#details-footer').outerHeight();
        $('#details-content').height(height - (height1 + height2));
        let width = $('#app-content').outerWidth();
        let backButton = $('#backButton').outerWidth();
        let homeButton = $('#homeButton').outerWidth();
        $('#projectHeading').width(width - (backButton));
        for (let i = 0; i < this.tabNames.length; i++) {
            let tab = this.tabNames[i];
            this.tabNameMap.set(tab.name, tab);
            this.tabNumberMap.set(tab.id, tab);
        }

    }

    tabNames = [
        {id: 1, name: 'project-details'},
        {id: 2, name: 'project-sites'},
        {id: 3, name: 'project-tasks'},
        {id: 4, name: 'project-files'},
        {id: 5, name: 'project-media'},
        {id: 6, name: 'project-problems'}
    ]


    ionViewWillEnter() {
        this.sharedService.showBusyIndicator();
        if (this.tabName == "project-details") {
            this.loadProject();
        } else if (this.tabName == "project-sites") {
            this.loadSites();
        } else if (this.tabName == "project-tasks") {
            this.loadTasks();
        } else if (this.tabName == "project-files") {
            this.loadFiles();
        } else if (this.tabName == "project-media") {
            this.loadMedia();
        } else if (this.tabName == "project-problems") {
            this.loadProblems();
        }
    }

    back() {
        if (this.commentsView) {
            this.hideHistory();
        } else {
            this.location.back();
        }

    }

    swipeEvent(event) {
        if (event.direction == 2) {
            let tab = this.tabNameMap.get(this.tabName);
            if (tab.id < 6) {
                let nextTab = this.tabNumberMap.get(tab.id + 1);
                this.activateTab(nextTab.name);
            }
        }

        if (event.direction == 4) {
            let tab = this.tabNameMap.get(this.tabName);
            if (tab.id > 1) {
                let nextTab = this.tabNumberMap.get(tab.id - 1);
                this.activateTab(nextTab.name);
            }
        }
    }

    home() {
        this.router.navigate(["home"])
    }

    loadProjectNative() {
        this.projectService.getProjectDetailsNative(this.id).then(
            (data:any)=> {
                this.project = JSON.parse(data.data);
                setTimeout(()=> {
                    let progress = document.getElementById("project" + this.project.id);
                    if (progress != null) {
                        progress.style.width = this.project.percentComplete + "%";
                    }
                    this.sharedService.hideBusyIndicator();
                }, 100)
                let height = $('#details-content').outerHeight();
                $('#project-details').height(height);
            }
        )
    }

    loadProject() {
        this.projectService.getProjectDetails(this.id).subscribe(
            (data:any)=> {
                this.project = data;
                setTimeout(()=> {
                    let progress = document.getElementById("project" + this.project.id);
                    if (progress != null) {
                        progress.style.width = this.project.percentComplete + "%";
                    }
                    this.sharedService.hideBusyIndicator();
                }, 100)
            }
        )
    }

    tabName = "project-details";

    selectTab(tab) {
        this.sharedService.showBusyIndicator();
        if (tab == "project-details") {
            this.loadProject();
        } else if (tab == "project-sites") {
            this.loadSites();
        } else if (tab == "project-tasks") {
            this.loadTasks();
        } else if (tab == "project-files") {
            this.loadFiles();
        } else if (tab == "project-media") {
            this.loadMedia();
        } else if (tab == "project-problems") {
            this.loadProblems();
        }
        this.tabName = tab;
        let object = document.getElementById(tab);
        object.style.background = "#e4d6d6";
        setTimeout(()=> {
            object.style.background = "#178e17";
        }, 100)
    }

    activateTab(tab) {
        this.sharedService.showBusyIndicator();
        if (tab == "project-details") {
            this.loadProject();
        } else if (tab == "project-sites") {
            this.loadSites();
        } else if (tab == "project-tasks") {
            this.loadTasks();
        } else if (tab == "project-files") {
            this.loadFiles();
        } else if (tab == "project-media") {
            this.loadMedia();
        } else if (tab == "project-problems") {
            this.loadProblems();
        }
        this.tabName = tab;
    }

    pageable = {
        page: 0,
        size: 10,
        sort: {
            field: "modifiedDate",
            order: "DESC"
        }
    };
    sites:any;
    tasks:any;
    problems:any;
    media:any;
    files:any;
    folders = [];

    loadSites() {
        this.projectService.getProjectSites(this.id, this.pageable).subscribe(
            (data:any)=> {
                this.sites = data;
                this.sharedService.hideBusyIndicator();
            }
        )
    }

    loadSitesNative() {
        this.projectService.getProjectSitesNative(this.id, this.pageable).then(
            (data:any)=> {
                this.sites = JSON.parse(data.data);
                this.sharedService.hideBusyIndicator();
            }
        )
    }

    loadTasks() {
        this.projectService.getProjectTasks(this.id).subscribe(
            (data:any)=> {
                this.tasks = data;
                setTimeout(()=> {
                    for (let i = 0; i < this.tasks.length; i++) {
                        let ipAddress = this.tasks[i];
                        let progress = document.getElementById("tasks" + ipAddress.task.id);
                        if (progress != null) {
                            progress.style.width = ipAddress.task.percentComplete + "%";
                        }
                    }
                    this.sharedService.hideBusyIndicator();
                }, 100)

            }
        )
    }

    loadTasksNative() {
        this.projectService.getProjectTasksNative(this.id).then(
            (data:any)=> {
                this.tasks = JSON.parse(data.data);
                setTimeout(()=> {
                    for (let i = 0; i < this.tasks.length; i++) {
                        let ipAddress = this.tasks[i];
                        let progress = document.getElementById("tasks" + ipAddress.task.id);
                        if (progress != null) {
                            progress.style.width = ipAddress.task.percentComplete + "%";
                        }
                    }
                    this.sharedService.hideBusyIndicator();
                }, 100)
            }
        )
    }

    loadProblems() {
        this.projectService.getProjectProblems(this.id).subscribe(
            (data:any)=> {
                this.problems = data;
                this.sharedService.hideBusyIndicator();
            }
        )
    }

    loadProblemsNative() {
        this.projectService.getProjectProblemsNative(this.id).then(
            (data:any)=> {
                this.problems = JSON.parse(data.data);
                this.sharedService.hideBusyIndicator();
            }
        )
    }

    loadMedia() {
        this.projectService.getProjectMedia(this.id, this.pageable).subscribe(
            (data:any)=> {
                this.media = data;
                for (let i = 0; i < this.media.length; i++) {
                    let media = this.media[i];
                    media.src = this.applicationUrl + "/api/col/media/" + media.id + "/bytes"
                }
                this.sharedService.hideBusyIndicator();
            }
        )
    }

    loadMediaNative() {
        this.projectService.getProjectMediaNative(this.id, this.pageable).then(
            (data:any)=> {
                this.media = JSON.parse(data.data);
                for (let i = 0; i < this.media.length; i++) {
                    let media = this.media[i];
                    media.src = this.applicationUrl + "/api/col/media/" + media.id + "/bytes"
                }
                this.sharedService.hideBusyIndicator();
            }
        )
    }

    loadFiles() {
        this.projectService.getProjectFiles(this.id).subscribe(
            (data:any)=> {
                this.folders = [];
                this.selectedFolder = null;
                if (data.length > 0) {
                    this.selectedFolder = data[0];
                    this.files = data[0].files;
                }
                for (let i = 0; i < data.length; i++) {
                    let folder = data[i];
                    folder.level = 0;
                    this.folders.push(folder);
                    this.visitFolder(folder);
                }
                this.sharedService.hideBusyIndicator();
            }
        )
    }

    visitFolder(folder) {
        for (let i = 0; i < folder.children.length; i++) {
            let child = folder.children[i];
            child.level = folder.level + 1;
            this.folders.push(child);
            this.visitFolder(child);
        }
    }

    loadFilesNative() {
        this.projectService.getProjectFilesNative(this.id).then(
            (data:any)=> {
                let folderData = JSON.parse(data.data);
                this.selectedFolder = null;
                this.folders = [];
                if (folderData.length > 0) {
                    this.selectedFolder = folderData[0];
                    this.files = folderData[0].files;
                }

                for (let i = 0; i < folderData.length; i++) {
                    let folder = folderData[i];
                    folder.level = 0;
                    this.folders.push(folder);
                    this.visitFolder(folder);
                }
                this.sharedService.hideBusyIndicator();
            }
        )
    }

    selectedFolder:any;

    loadFolderFiles(folder) {
        this.selectedFolder = folder;
        this.files = folder.files;
        this.hideFoldersView();

    }

    loadSelectedFolderFiles() {
        this.projectService.getProjectFolderFilesNative(this.id, this.selectedFolder.id).then(
            (data:any)=> {
                let filesData = JSON.parse(data.data);
                this.files = filesData;
                this.sharedService.hideBusyIndicator();
                alert("File Uploaded Successfully");
            }
        )
    }


    openSite(site) {
        this.sharedService.setSiteId(site.id);
        this.router.navigate(['sites/' + site.id]);
    }

    openTask(task) {
        this.sharedService.setTaskId(task.id);
        this.router.navigate(['tasks/' + task.id]);
    }

    newTask() {
        this.router.navigate(['projectView1/' + this.project.id + '/task']);
    }

    newProblem() {
        this.sharedService.setNewProblemType("PROJECT");
        this.router.navigate(['tasks/' + this.project.id + '/problem']);
    }


    openProblem(problem) {
        this.sharedService.setProblemId(problem.id);
        this.router.navigate(['problems/' + problem.id]);
    }

    showCommentsView() {
        this.sharedService.showBusyIndicator();
        let modal = document.getElementById("project-comments");
        modal.style.display = "block";
        let height = $('#app-content').outerHeight();
        let projectIcons = $('#projectIcons').outerHeight();
        let header = $("#comments-header").outerHeight();
        let content = $('.modal-content').outerHeight();
        let footer = $('#footer').outerHeight();

        $("#comments-content").height(content - header);
        let detailsHeight = $("#comments-content").outerHeight();
        $("#comments").height(detailsHeight - footer);
        this.commentsView = true;
        this.loadComments();
    }

    hideHistory() {
        let modal = document.getElementById("project-comments");
        modal.style.display = "none";
        this.commentsView = false;
        this.comments = [];
    }

    createComment() {
        if (this.emptyComment.comment != "" && this.emptyComment.comment != null && this.emptyComment.comment != undefined) {
            this.sharedService.showBusyIndicator();
            this.emptyComment.objectId = this.id;
            this.projectService.createComment(this.emptyComment).subscribe(
                (data:any)=> {
                    this.loadComments();
                }, (error)=> {
                    this.sharedService.hideBusyIndicator();
                }
            )

            /*this.projectService.createCommentNative(this.emptyComment).then(
             (data:any)=> {
             this.loadCommentsNative();
             }, (error)=> {
             this.sharedService.hideBusyIndicator();
             }
             )*/
        }
    }

    comments:any;
    emptyComment = {
        objectType: "PROJECT",
        objectId: null,
        comment: ""
    };

    loadComments() {
        this.projectService.getProjectComments(this.id, "PROJECT", this.pageable).subscribe(
            (data:any)=> {
                this.comments = data;
                this.emptyComment = {
                    objectType: "PROJECT",
                    objectId: null,
                    comment: ""
                };
                setTimeout(()=> {
                    this.sharedService.hideBusyIndicator();
                }, 500)
            }
        )
    }

    loadCommentsNative() {
        this.projectService.getProjectCommentsNative(this.id, "PROJECT", this.pageable).then(
            (data:any)=> {
                this.comments = JSON.parse(data.data);
                this.emptyComment = {
                    objectType: "PROJECT",
                    objectId: null,
                    comment: ""
                };
                this.sharedService.hideBusyIndicator();
            }
        )
    }

    callToNumber(number) {
        setTimeout(() => {
            let tel = number;
            window.open(`tel:${tel}`, '_system');
        }, 100);
    }
    showSiteDetails = true;
    showFoldersView() {
        this.sharedService.showBusyIndicator();

        let modal = document.getElementById("folders-view");

        let height = $('#app-content').outerHeight();
        let projectIcons = $('#details-footer').outerHeight();
        let header = $("#details-heading").outerHeight();
        let sideNavigation = $('#folders-view');

        modal.style.height = height - (header + projectIcons) + 'px';
        modal.style.bottom = projectIcons + 'px';
        if (sideNavigation.hasClass('visible')) {
            sideNavigation.animate({"left": "-50%"}, "500").removeClass('visible');
        } else {
            sideNavigation.animate({
                "left": "0%"
            }, "500").addClass('visible');
        }
        //modal.style.display = "block";
        //modal.style.height = height - (header + projectIcons) + 'px';
        //modal.style.bottom = projectIcons + 'px';
        this.sharedService.hideBusyIndicator();
    }

    hideFoldersView() {
        let sideNavigation = $('#folders-view');
        if (sideNavigation.hasClass('visible')) {
            sideNavigation.animate({"left": "-50%"}, "500").removeClass('visible');
        } else {
            sideNavigation.animate({
                "left": "0%"
            }, "500").addClass('visible');
        }
    }

    openFileSystem() {
        this.fileChooser.open()
            .then((uri) => {
                this.filePath.resolveNativePath(uri).then(filePath => {
                    //alert("File  Path : " + filePath);
                    this.file.resolveLocalFilesystemUrl(filePath).then(fileInfo => {
                        let files = fileInfo as FileEntry;

                        files.file(success => {
                            //alert("File Name " + success.name);

                            const reader = new FileReader();
                            reader.onloadend = () => {
                                const imgBlob = new Blob([reader.result], {
                                    type: success.type,
                                });
                                const formData = new FormData();
                                formData.append('fileName', success.name);
                                formData.append('file', imgBlob, success.name);
                                this.sharedService.showBusyIndicator();
                                this.projectService.uploadFolderFiles(this.id, this.selectedFolder.id, formData)
                                    .then((data) => {
                                        this.loadSelectedFolderFiles();
                                    }, (err) => {
                                        alert(err);
                                        alert(err.status);
                                        alert(err.message);
                                        this.sharedService.hideBusyIndicator();
                                    });
                            };
                            reader.readAsArrayBuffer(success);
                        });
                    }, err => {
                        console.log(err);
                        throw err;
                    });
                })
            })
            .catch(e => alert("Error"));
    }
}
