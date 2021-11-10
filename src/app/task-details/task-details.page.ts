import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { SharedService } from '../services/shared.service';
import { ProjectService } from '../services/project.service';
import { URLService } from '../services/url.service';
import { Location } from "@angular/common";
import * as $ from 'jquery';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import {File, IWriteOptions, FileEntry} from '@ionic-native/file/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation/ngx';
import { ActionSheetController } from '@ionic/angular';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

declare var google;
@Component({
    selector: 'app-task-details',
    templateUrl: './task-details.page.html',
    styleUrls: ['./task-details.page.scss'],
})
export class TaskDetailsPage implements OnInit {
    projectId:any;
    taskId:any;
    viewInfo:any;
    task:any;
    taskTabName = "task-details";
    files:any;
    media:any;
    problems:any;
    applicationUrl:any;
    geoOptions:GeolocationOptions;
    currentPos:Geoposition;

    completion = {
        unitsCompleted: 0,
        notes: null,
        completedBy: '',
        task:null
    }

    constructor(private router:Router, private ar:ActivatedRoute, private projectService:ProjectService, private sharedService:SharedService,
                private urlService:URLService, private backNav:Location, private file:File, private camera:Camera,
                private geolocation:Geolocation, private fileChooser:FileChooser, private filePath:FilePath) {
        this.viewInfo = this.sharedService.getValue();
        this.projectId = this.viewInfo.projectId;
        this.taskId = this.viewInfo.taskId;
        this.applicationUrl = this.urlService.viewInfo.restUrl;
        this.getLocation();
    }


    ngOnInit() {
        this.sharedService.showBusyIndicator();
        this.loadTask();
        let height = $('#app-content').outerHeight();
        let height1 = $('#taskDetails-heading').outerHeight();
        $('#taskDetails-content').height(height - (height1));
    }

    ionViewWillEnter() {
        this.sharedService.showBusyIndicator();
        if (this.taskTabName == "task-details") {
            this.loadTask();
        } else if (this.taskTabName == "task-files") {
            this.loadFiles();
        } else if (this.taskTabName == "task-media") {
            this.loadMedia();
        } else if (this.taskTabName == "task-problems") {
            this.loadProblems();
        }
    }

    back() {
        this.backNav.back();
    }

    loadTask() {
        this.projectService.getTask(this.projectId, this.taskId).subscribe(
            (data:any)=> {
                this.task = data;
                this.taskCompletionHistories = data;
                this.loadTaskCompletionHistory();
                let progress = document.getElementById("task" + this.task.id);
                if (progress != null) {
                    progress.style.width = this.task.percentComplete + "%";
                }
                this.sharedService.hideBusyIndicator();
            }
        )
    }

    taskCompletionHistories:any;

    loadTaskCompletionHistory() {
        this.projectService.getTaskCompletionHistory(this.task.id).subscribe(
            (data:any)=> {
                this.taskCompletionHistories = data.taskCompletionHistories;
            }
        )
    }

    loadTaskCompletionHistoryNative() {
        this.projectService.getTaskCompletionHistoryNative(this.task.id).then(
            (data:any)=> {
                let completionData = JSON.parse(data.data);
                this.taskCompletionHistories = completionData.taskCompletionHistories
            }
        )
    }

    showNewCompletion = false;

    showNewCompletionView() {
        this.showNewCompletion = !this.showNewCompletion;
    }

    loadTaskNative() {
        this.projectService.getTaskNative(this.projectId, this.taskId).then(
            (data:any)=> {
                this.task = JSON.parse(data.data);
                this.loadTaskCompletionHistoryNative();
                let progress = document.getElementById("task" + this.task.id);
                if (progress != null) {
                    progress.style.width = this.task.percentComplete + "%";
                }
                this.sharedService.hideBusyIndicator();
            }
        )
    }

    selectTaskTab(tab) {
        this.sharedService.showBusyIndicator();
        if (tab == "task-details") {
            this.loadTask();
        } else if (tab == "task-files") {
            this.loadFiles();
        } else if (tab == "task-media") {
            this.loadMedia();
        } else if (tab == "task-problems") {
            this.loadProblems();
        }
        this.taskTabName = tab;
        let object = document.getElementById(tab);
        object.style.background = "#e4d6d6";
        setTimeout(()=> {
            object.style.background = "#178e17";
        }, 100)
    }

    loadFiles() {
        this.projectService.getTaskFiles(this.projectId, this.task.id).subscribe(
            (data:any)=> {
                this.files = data;
                this.sharedService.hideBusyIndicator();
            }
        )
    }

    loadFilesNative() {
        this.projectService.getTaskFilesNative(this.projectId, this.task.id).then(
            (data:any)=> {
                this.files = JSON.parse(data.data);
                this.sharedService.hideBusyIndicator();
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
                if (this.media.length > 0) {
                    setTimeout(()=> {
                        this.sharedService.hideBusyIndicator();
                    }, 500)
                } else {
                    this.sharedService.hideBusyIndicator();
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
                if (this.media.length > 0) {
                    setTimeout(()=> {
                        this.sharedService.hideBusyIndicator();
                    }, 500)
                } else {
                    this.sharedService.hideBusyIndicator();
                }
            }
        )
    }

    loadProblems() {
        this.projectService.getTaskProblems(this.projectId, this.task.id).subscribe(
            (data:any)=> {
                this.problems = data;
                this.sharedService.hideBusyIndicator();
            }
        )
    }

    loadProblemsNative() {
        this.projectService.getTaskProblemsNative(this.projectId, this.task.id).then(
            (data:any)=> {
                this.problems = JSON.parse(data.data);
                this.sharedService.hideBusyIndicator();
            }
        )
    }

    newTaskProblem() {
        this.sharedService.setNewProblemType("TASK");
        this.router.navigate(['tasks/' + this.task.id + '/problem']);
    }

    location = {
        latitude: null,
        longitude: null,
        uploadFrom: null,
        description: null
    };

    cameraOptions:CameraOptions = {
        quality: 20,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true
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

    takePicture(sourceType) {
        this.cameraOptions.sourceType = sourceType;
        this.camera.getPicture(this.cameraOptions).then((imageData) => {
            this.selectedImage = (<any>window).Ionic.WebView.convertFileSrc(imageData);
            this.file.resolveLocalFilesystemUrl(imageData).then((entry:FileEntry) => {
                entry.file(file => {
                    alert(file);
                    //this.readFile(file);
                    this.selectedFile = file;
                    this.showPictureDialog();
                });
            });
        }, (err) => {
            alert("File Error");
        });
    }

    selectedImage = null;
    selectedImageDescription = null;
    selectedFile = null;

    uploadImage() {
        if (this.selectedImageDescription == null || this.selectedImageDescription == null) {
            alert("Enter Image Description");
        } else {
            this.readFile(this.selectedFile);
        }
    }

    cancelImage() {
        this.selectedImage = null;
        this.selectedImageDescription = null;
        this.hideHistory();
    }

    readFile(file:any) {
        this.sharedService.showBusyIndicator();
        const reader = new FileReader();
        reader.onloadend = () => {
            const imgBlob = new Blob([reader.result], {
                type: file.type
            });
            const formData = new FormData();
            formData.append('name', 'Hello');
            formData.append('file', imgBlob, file.name);
            this.location.description = this.selectedImageDescription;
            this.projectService.uploadProjectMedia(this.task.id, formData, this.location)
                .then((data) => {
                    this.selectedImage = null;
                    this.selectedImageDescription = null;
                    this.hideHistory();
                    this.loadFilesNative();
                    this.sharedService.hideBusyIndicator();
                    alert(data + " Uploaded Successfully");
                }, (err) => {
                    alert(err.err.message);
                    this.sharedService.hideBusyIndicator();
                });
        };
        reader.readAsArrayBuffer(file);
    }

    openProblem(problem) {
        this.sharedService.setProblemId(problem.id);
        this.router.navigate(['problems/' + problem.id]);
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
                                formData.append('name', 'Hello');
                                formData.append('fileName', success.name);
                                formData.append('file', imgBlob, success.name);

                                this.projectService.uploadTaskFiles(this.projectId, this.task.id, formData)
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

    showPictureDialog() {
        let modal = document.getElementById("image-dialog");
        modal.style.display = "block";
        let height = $('#app-content').outerHeight();
        let footer = $('#image-footer').outerHeight();

        let content = $('.image-content').outerHeight();

        $("#photo-content").height(content - footer);
        let detailsHeight = $("#photo-content").outerHeight();
        $("#images-view").height(detailsHeight);
    }

    hideHistory() {
        let modal = document.getElementById("image-dialog");
        modal.style.display = "none";
    }

    callToNumber(number) {
        setTimeout(() => {
            let tel = number;
            window.open(`tel:${tel}`, '_system');
        }, 100);
    }

    save() {
        if (this.completion.unitsCompleted == 0) {
            alert("Please Enter Units Completed");
        } else if ((this.task.totalUnitsCompleted + this.completion.unitsCompleted) <= this.task.totalUnits) {
            this.sharedService.showBusyIndicator();
            this.completion.completedBy = this.sharedService.getValue().loginDetails.person.id;
            this.completion.task = this.task.id;
            this.projectService.updateTaskCompletionHistory(this.projectId, this.task.id, this.completion).subscribe(
                (data:any)=> {
                    this.completion = {
                        unitsCompleted: 0,
                        notes: null,
                        completedBy: '',
                        task:null
                    }
                    this.loadTask();
                    this.sharedService.hideBusyIndicator();
                    alert("Task Completion updated successfully");
                }, (error:any)=> {
                    this.sharedService.hideBusyIndicator();
                    alert(error.error.message);
                }
            )
        } else {
            alert("Units Completed cannot be greater than " + (this.task.totalUnits - this.task.totalUnitsCompleted));
        }
    }

    saveNative() {
        if (this.completion.unitsCompleted == 0) {
            alert("Please Enter Units Completed");
        } else if ((this.task.totalUnitsCompleted + this.completion.unitsCompleted) <= this.task.totalUnits) {
            this.sharedService.showBusyIndicator();
            this.completion.completedBy = this.sharedService.getValue().loginDetails.person.id;
            this.completion.task = this.task.id;
            this.projectService.updateTaskCompletionHistoryNative(this.projectId, this.task.id, this.completion).then(
                (data:any)=> {
                    this.completion = {
                        unitsCompleted: 0,
                        notes: null,
                        completedBy: '',
                        task:null
                    }
                    this.loadTaskNative();
                    this.sharedService.hideBusyIndicator();
                    alert("Task Completion updated successfully");
                }, (error:any)=> {
                    this.sharedService.hideBusyIndicator();
                    alert(error.error.message);
                }
            )
        } else {
            alert("Units Completed cannot be greater than " + (this.task.totalUnits - this.task.totalUnitsCompleted));
        }
    }
}
