import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { SharedService } from '../../services/shared.service';
import { ProjectService } from '../../services/project.service';
import { URLService } from '../../services/url.service';
import * as $ from 'jquery';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import {File, IWriteOptions, FileEntry} from '@ionic-native/file/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation/ngx';
import { ActionSheetController } from '@ionic/angular';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
declare var google;
@Component({
    selector: 'app-task',
    templateUrl: './task.page.html',
    styleUrls: ['./task.page.scss'],
})
export class TaskPage implements OnInit {
    id:any;
    viewInfo:any;
    tasks:any;
    showDetails:any;
    task:any;
    files:any;
    media:any;
    problems:any;
    tabName = "details";
    applicationUrl:any;
    title = "Task Details";

    pageable = {
        page: 0,
        size: 10,
        sort: {
            field: "modifiedDate",
            order: "DESC"
        }
    };

    geoOptions:GeolocationOptions;
    currentPos:Geoposition;

    constructor(private router:Router, private ar:ActivatedRoute, private projectService:ProjectService,
                private sharedService:SharedService, private urlService:URLService, private fileTransfer:FileTransfer,
                private file:File, private camera:Camera, private geolocation:Geolocation, public actionSheetController:ActionSheetController,
                private fileChooser:FileChooser, private filePath:FilePath, private callNumber:CallNumber, private androidPermissions:AndroidPermissions) {
        this.viewInfo = this.sharedService.getValue();
        this.id = this.viewInfo.projectId;
        this.applicationUrl = this.urlService.viewInfo.restUrl;
        this.getLocation();
    }

    ngOnInit() {
        this.loadTasksNative();
    }

    ionViewWillEnter() {
        this.loadTasksNative();
    }

    tasksView() {
        this.tabName = "details";
        this.files = [];
        this.task = null;
        this.media = [];
        this.problems = [];
        this.sharedService.setProjectIcons(true);
        this.sharedService.setTaskIcons(false);
        this.sharedService.setTasksView(true);
    }

    loadTasks() {
        this.sharedService.setProjectIcons(true);
        this.sharedService.setTaskIcons(false);
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
                }, 500)
            }
        )
    }

    openTask(task) {
        /*this.sharedService.setTaskId(task.id);
         this.router.navigate(['project/tasks/' + task.id + "/details"]);*/
        this.sharedService.setTasksView(false);
        let height = $('#app-content').outerHeight();
        let height2 = $('#project-header').outerHeight();
        $('#taskDetails').height(height - (height2 * 3));
        this.loadTaskNative(task);
        this.viewInfo.showProjectIcons = false;
        this.viewInfo.showTaskIcons = true;
        this.sharedService.setProjectIcons(false);
        this.sharedService.setTaskIcons(true);


    }

    showTaskDetails() {
        this.tabName = "details";
        this.title = "Task Details";
        setTimeout(()=> {
            let progress = document.getElementById("task" + this.task.id);
            if (progress != null) {
                progress.style.width = this.task.percentComplete + "%";
            }
        }, 100)
    }

    showTaskFiles() {
        this.tabName = "files";
        this.title = "Task Files";
        this.loadFiles();

    }

    showTaskMedia() {
        this.tabName = "media";
        this.title = "Task Media";
        this.loadMedia();
    }

    showTaskProblems() {
        this.tabName = "problems";
        this.title = "Task Problems";
        this.loadProblems();

    }

    loadFiles() {
        this.projectService.getTaskFiles(this.id, this.task.id).subscribe(
            (data:any)=> {
                this.files = data;
            }
        )
    }

    loadFilesNative() {
        this.projectService.getTaskFilesNative(this.id, this.task.id).then(
            (data:any)=> {
                this.files = JSON.parse(data.data);
            }
        )
    }

    loadMedia() {
        this.projectService.getTaskMedia(this.task.id).subscribe(
            (data:any)=> {
                this.media = data;
                for (let i = 0; i < this.media.length; i++) {
                    let media = this.media[i];
                    media.src = this.applicationUrl + "/api/col/media/" + media.id + "/bytes"
                }
            }
        )
    }

    loadMediaNative() {
        this.projectService.getTaskMediaNative(this.task.id).then(
            (data:any)=> {
                this.media = JSON.parse(data.data);
                for (let i = 0; i < this.media.length; i++) {
                    let media = this.media[i];
                    media.src = this.applicationUrl + "/api/col/media/" + media.id + "/bytes"
                }
            }
        )
    }

    loadProblems() {
        this.projectService.getTaskProblems(this.id, this.task.id).subscribe(
            (data:any)=> {
                this.problems = data;
            }
        )
    }

    loadProblemsNative() {
        this.projectService.getTaskProblemsNative(this.id, this.task.id).then(
            (data:any)=> {
                this.problems = JSON.parse(data.data);
            }
        )
    }

    loadTask(task) {
        this.projectService.getTask(this.id, task.id).subscribe(
            (data:any)=> {
                this.task = data;
                setTimeout(()=> {
                    let progress = document.getElementById("task" + this.task.id);
                    if (progress != null) {
                        progress.style.width = this.task.percentComplete + "%";
                    }
                }, 100)
            }
        )
    }

    loadTaskNative(task) {
        this.projectService.getTaskNative(this.id, task.id).then(
            (data:any)=> {
                this.task = JSON.parse(data.data);
                setTimeout(()=> {
                    let progress = document.getElementById("task" + this.task.id);
                    if (progress != null) {
                        progress.style.width = this.task.percentComplete + "%";
                    }
                }, 100)
            }
        )
    }

    openFileSystem() {
        this.fileChooser.open()
            .then((uri) => {
                this.filePath.resolveNativePath(uri).then(filePath => {
                    alert("File  Path : " + filePath);
                    this.file.resolveLocalFilesystemUrl(filePath).then(fileInfo => {
                        let files = fileInfo as FileEntry;

                        files.file(success => {
                            alert("File Name " + success.name);

                            const reader = new FileReader();
                            reader.onloadend = () => {
                                const imgBlob = new Blob([reader.result], {
                                    type: success.type,
                                });
                                const formData = new FormData();
                                formData.append('name', 'Hello');
                                formData.append('fileName', success.name);
                                formData.append('file', imgBlob, success.name);

                                this.projectService.uploadTaskFiles(this.id, this.task.id, formData)
                                    .then((data) => {
                                        this.loadFiles();
                                        alert(data + " Uploaded Successfully");
                                    }, (err) => {
                                        alert(err);
                                        alert(err.status);
                                        alert(err.message);
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

    location = {
        latitude: null,
        longitude: null,
        uploadFrom: null,
        description: null
    };

    /*cameraOptions:CameraOptions = {
     quality: 20,
     destinationType: this.camera.DestinationType.FILE_URI,
     encodingType: this.camera.EncodingType.JPEG,
     mediaType: this.camera.MediaType.PICTURE,
     correctOrientation: true
     }*/

    readFile(file:any) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const imgBlob = new Blob([reader.result], {
                type: file.type
            });
            const formData = new FormData();
            formData.append('name', 'Hello');
            formData.append('file', imgBlob, file.name);
            this.projectService.uploadProjectMedia(this.task.id, formData, this.location)
                .then((data) => {
                    alert("Uploaded Successfully");
                }, (err) => {
                    alert(err);
                    alert(err.status);
                    alert(err.message);
                });
        };
        reader.readAsArrayBuffer(file);
    }

    getLocation() {
        this.geoOptions = {
            enableHighAccuracy: false
        };
        this.geolocation.getCurrentPosition(this.geoOptions).then((pos:Geoposition) => {

            this.currentPos = pos;

            //alert(pos.coords.latitude);
            this.location.latitude = pos.coords.latitude;
            this.location.longitude = pos.coords.longitude;
            var geocoder = new google.maps.Geocoder();
            var latlng = new google.maps.LatLng(this.location.latitude, this.location.longitude);
            var request = {
                latLng: latlng
            };
            geocoder.geocode(request, function (data, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (data[0] != null) {
                        this.location.uploadFrom = data[0].formatted_address;
                    }
                }

            })
            //alert("Google Map Status : " + google.maps.GeocoderStatus);

        }, (err:PositionError)=> {
            console.log("error : " + err.message);
        })

    }

    cameraOptions:CameraOptions = {
        quality: 20,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true
    }

    takePicture(sourceType) {
        this.cameraOptions.sourceType = sourceType;
        this.camera.getPicture(this.cameraOptions).then((imageData) => {
            this.file.resolveLocalFilesystemUrl(imageData).then((entry:FileEntry) => {
                entry.file(file => {
                    alert(file);
                    this.readFile(file);
                });
            });
        }, (err) => {
            alert("File Error");
        });
    }

    /*async

     selectImage() {
     let actionSheet = await
     this.actionSheetController.create({
     header: "Select Image source",
     buttons: [{
     text: 'From Gallery',
     handler: () => {
     this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
     }
     },
     {
     text: 'Use Camera',
     handler: () => {
     this.takePicture(this.camera.PictureSourceType.CAMERA);
     }
     }
     ]
     });
     await
     actionSheet.present();
     }*/

    callToNumber(phoneNumber) {
        setTimeout(() => {
            let tel = phoneNumber;
            window.open(`tel:${tel}`, '_system');
        }, 100);
    }


    projectPersons:any;
    types:any;
    priorities = ["LOW", "MEDIUM", "HIGH"];

    newProblem = {
        id: null,
        targetObjectId: null,
        targetObjectType: "TASK",
        type: null,
        priority: null,
        title: null,
        description: null,
        status: "NEW",
        assignedTo: null,
        task: null
    }

    newProblemView() {
        let modal = document.getElementById("new-task-problem");
        modal.style.display = "block";
        this.loadProjectTeam();
        this.loadIssueTypes();
    }

    sites:any;

    loadProjectTeam() {
        this.projectService.getProjectTeam(this.id).subscribe(
            (data:any)=> {
                this.projectPersons = data;
            }
        )
    }

    hideProblem() {
        let modal = document.getElementById("new-task-problem");
        modal.style.display = "none";
    }

    loadIssueTypes() {
        this.projectService.getIssueTypes().subscribe(
            (data:any)=> {
                this.types = data;
            }
        )
    }

    wbsItems:any;

    createProblem() {
        if (this.validateProblem()) {
            this.newProblem.assignedTo = this.newProblem.assignedTo.id;
            this.newProblem.targetObjectId = this.task.id;
            this.newProblem.type = this.newProblem.type.id;
            this.projectService.createProblem(this.newProblem).subscribe(
                (data:any)=> {
                    this.loadProblems();
                    this.hideProblem();
                    this.sharedService.setProblemsView(true);
                }
            )
        }
    }

    hasError = false;
    errorMessage = "";

    validateProblem() {
        let valid = true;

        if (this.newProblem.title == null || this.newProblem.title == "" || this.newProblem.title == undefined) {
            valid = false;
            this.hasError = true;
            this.errorMessage = "Please select Type";
        } else if (this.newProblem.title == null || this.newProblem.title.trim() == "") {
            valid = false;
            this.hasError = true;
            this.errorMessage = "Problem Title cannot be empty";
        }
        else if (this.newProblem.priority == null || this.newProblem.priority == "") {
            valid = false;
            this.hasError = true;
            this.errorMessage = "Problem Priority cannot be empty";
        } else if (this.newProblem.assignedTo == null) {
            valid = false;
            this.hasError = true;
            this.errorMessage = "AssignedTo cannot be empty";
        }

        setTimeout(()=> {
            this.hasError = false;
            this.errorMessage = "";
        }, 3000);

        return valid;
    }

    newTask = {
        id: null,
        name: null,
        description: null,
        project: null,
        plannedStartDate: null,
        plannedFinishDate: null,
        status: null,
        wbsItem: null,
        site: null,
        person: null,
        unitOfWork: null,
        totalUnits: null,
        inspectedBy: null,
        subContract: false,
        workflow: null,
        wfStatus: null
    }

    newTaskView() {
        this.sharedService.setProjectIcons(false);
        let modal = document.getElementById("new-task");
        modal.style.display = "block";
        let height = $('#app-content').outerHeight();
        let header = $('#new-task-header').outerHeight();
        $("#new-task-content").height(height - header * 2);
    }

    hideNewTask() {
        let modal = document.getElementById("new-task");
        modal.style.display = "none";
        this.sharedService.setProjectIcons(true);
    }
}
