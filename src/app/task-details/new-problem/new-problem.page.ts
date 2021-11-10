import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { SharedService } from '../../services/shared.service';
import { ProjectService } from '../../services/project.service';
import * as $ from 'jquery';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import {File, IWriteOptions, FileEntry} from '@ionic-native/file/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
declare var google;
declare var window;
@Component({
    selector: 'app-new-problem',
    templateUrl: './new-problem.page.html',
    styleUrls: ['./new-problem.page.scss'],
})
export class NewProblemPage implements OnInit {
    taskId:any;
    projectId:any;
    photos = [];
    images = [];

    constructor(private backNav:Location, private projectService:ProjectService,
                private sharedService:SharedService, private file:File, private camera:Camera,
                private geolocation:Geolocation, private filePath:FilePath) {
        this.projectId = this.sharedService.getValue().projectId;
        this.taskId = this.sharedService.getValue().taskId;
        this.getLocation();
    }

    ngOnInit() {
        this.sharedService.showBusyIndicator();
        this.loadIssueTypes();
        this.loadProjectTeam();
        let height = $('#app-content').outerHeight();
        let height1 = $('#problem-heading').outerHeight();
        $('#problem-content').height(height - (height1));
    }

    back() {
        this.backNav.back();
    }

    projectPersons:any;
    types:any;
    priorities = ["LOW", "MEDIUM", "HIGH"];

    newProblem = {
        id: null,
        targetObjectId: null,
        targetObjectType: null,
        type: null,
        typeObject: null,
        priority: null,
        priorityObject: null,
        title: null,
        description: null,
        status: "NEW",
        assignedTo: null,
        assignedToObject: null,
        task: null
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
                this.sharedService.hideBusyIndicator();
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
                this.sharedService.hideBusyIndicator();
            }
        )
    }

    loadIssueTypesNative() {
        this.projectService.getIssueTypesNative().then(
            (data:any)=> {
                this.types = JSON.parse(data.data);
                this.loadProjectTeamNative();
            }
        )
    }

    createProblem() {
        if (this.validateProblem()) {
            this.sharedService.showBusyIndicator();
            this.newProblem.type = this.newProblem.typeObject.id;
            this.newProblem.priority = this.newProblem.priorityObject;
            this.newProblem.assignedTo = this.newProblem.assignedToObject.id;
            if (this.sharedService.getValue().newProblemType == "TASK") {
                this.newProblem.targetObjectType = this.sharedService.getValue().newProblemType;
                this.newProblem.targetObjectId = this.taskId;
            } else {
                this.newProblem.targetObjectType = this.sharedService.getValue().newProblemType;
                this.newProblem.targetObjectId = this.projectId;
            }

            this.projectService.createProblem(this.newProblem).subscribe(
                (data:any)=> {
                    let count = 0;
                    if (this.problemsPhotos.length > 0) {
                        for (let i = 0; i < this.problemsPhotos.length; i++) {
                            let photo = this.problemsPhotos[i];
                            let imageObject = this.images[i];
                            alert("Description : " + imageObject.description);
                            this.location.description = imageObject.description;
                            this.projectService.uploadProjectMedia(data.id, photo, this.location)
                                .then((data) => {
                                    count++;
                                    if (count == this.problemsPhotos.length) {
                                        this.sharedService.hideBusyIndicator();
                                        alert("Problem created successfully");
                                        this.back();
                                    }
                                }, (err) => {
                                    alert(err.message);
                                }
                            );
                        }
                    } else {
                        this.sharedService.hideBusyIndicator();
                        alert("Problem created successfully");
                        this.back();
                    }

                }
            )
        }
    }

    createProblemNative() {
        let imageObject = {
            image: null,
            description: null,
            fileName: null,
            file: null
        }
        if (this.imageName != null) {
            imageObject.description = this.imageDescription;
            imageObject.image = this.image;
            imageObject.fileName = this.imageName;
            this.images.push(imageObject);

            this.image = null;
            this.imageDescription = null;
            this.imageName = null;
        }
        if (this.validateProblem()) {
            this.sharedService.showBusyIndicator();
            this.newProblem.type = this.newProblem.typeObject.id;
            this.newProblem.priority = this.newProblem.priorityObject;
            this.newProblem.assignedTo = this.newProblem.assignedToObject.id;
            if (this.sharedService.getValue().newProblemType == "TASK") {
                this.newProblem.targetObjectType = this.sharedService.getValue().newProblemType;
                this.newProblem.targetObjectId = this.taskId;
            } else {
                this.newProblem.targetObjectType = this.sharedService.getValue().newProblemType;
                this.newProblem.targetObjectId = this.projectId;
            }

            this.projectService.createProblemNative(this.newProblem).then(
                (data:any)=> {
                    let count = 0;
                    let problemData = JSON.parse(data.data);
                    alert(problemData.id);
                    if (this.problemsPhotos.length > 0) {
                        for (let i = 0; i < this.problemsPhotos.length; i++) {
                            let photo = this.problemsPhotos[i];
                            let imageObject = this.images[i];
                            alert("Description : " + imageObject.description);
                            this.location.description = imageObject.description;
                            this.projectService.uploadProjectMedia(problemData.id, photo, this.location)
                                .then((data) => {
                                    count++;
                                    if (count == this.problemsPhotos.length) {
                                        this.sharedService.hideBusyIndicator();
                                        alert("Problem created successfully");
                                        this.back();
                                    }
                                }, (err) => {
                                    alert(err.message);
                                }
                            );
                        }
                    } else {
                        this.sharedService.hideBusyIndicator();
                        alert("Problem created successfully");
                        this.back();
                    }

                }
            )
        }
    }

    hasError = false;
    errorMessage = "";

    validateProblem() {
        let valid = true;

        if (this.newProblem.typeObject == null || this.newProblem.typeObject == "" || this.newProblem.typeObject == undefined) {
            valid = false;
            alert("Please select Type");
        } else if (this.newProblem.title == null || this.newProblem.title.trim() == "") {
            valid = false;
            alert("Problem Title cannot be empty");
        } else if (this.newProblem.priorityObject == null || this.newProblem.priorityObject == "") {
            valid = false;
            alert("Problem Priority cannot be empty");
        } else if (this.newProblem.assignedToObject == null || this.newProblem.assignedToObject == "") {
            valid = false;
            alert("AssignedTo cannot be empty");
        } else if (this.images.length > 0 && !this.validImages()) {
            valid = false;
            alert("Enter Description from Images")
        }

        return valid;
    }

    validImages() {
        let valid = true;
        for (let i = 0; i < this.images.length; i++) {
            let imageObject = this.images[i];
            if (valid) {
                if (imageObject.description == null || imageObject.description == "") {
                    valid = false;
                    this.selectedImage = imageObject;
                }
            }
        }

        return valid;

    }

    geoOptions:GeolocationOptions;
    currentPos:Geoposition;
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

    image = null;
    imageName = null;
    imageDescription = null;
    selectedImage = null;
    showDescription = false;

    selectImage(imageObject) {
        this.showDescription = false;
        this.selectedImage = imageObject;
    }

    selectImageType() {
        this.selectedImage = null;
        this.showDescription = true;
    }

    count = 0;

    takePicture(sourceType) {
        let imageObject = {
            image: null,
            description: null,
            fileName: null,
            file: null
        }
        if (this.imageName != null) {
            imageObject.description = this.imageDescription;
            imageObject.image = this.image;
            imageObject.fileName = this.imageName;
            this.images.push(imageObject);

            this.image = null;
            this.imageDescription = null;
            this.imageName = null;
        }
        this.count++;
        if (sourceType == "camera") {
            this.cameraOptions.sourceType = this.camera.PictureSourceType.CAMERA;
        } else {
            this.cameraOptions.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
        }

        this.camera.getPicture(this.cameraOptions).then((imageData) => {
            this.image = (<any>window).Ionic.WebView.convertFileSrc(imageData);
            this.showDescription = true;
            //imageObject.image = (<any>window).Ionic.WebView.convertFileSrc(imageData);

            this.filePath.resolveNativePath(imageData).then(filePath => {
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
                            this.imageName = this.count + success.name;
                            //imageObject.fileName = this.count + success.name;
                            //this.images.push(imageObject);
                            formData.append(this.count + success.name, "");
                            formData.append('file', imgBlob, success.name);
                            this.problemsPhotos.push(formData);
                        };
                        reader.readAsArrayBuffer(success);
                    });
                }, err => {
                    console.log(err);
                    throw err;
                });
            })
        }, (err) => {
            alert("File Error");
        });
    }

    problemsPhotos = [];

    readFile(file:any) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const imgBlob = new Blob([reader.result], {
                type: file.type
            });
            const formData = new FormData();
            formData.append('name', 'Hello');
            formData.append('description', "Subramanyam");
            formData.append('file', imgBlob, file.name);
            this.problemsPhotos.push(formData);

        };
        reader.readAsArrayBuffer(file);
    }

}
