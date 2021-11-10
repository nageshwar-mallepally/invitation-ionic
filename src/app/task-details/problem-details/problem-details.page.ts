import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { SharedService } from '../../services/shared.service';
import { ProjectService } from '../../services/project.service';
import { URLService } from '../../services/url.service';
import { Location } from "@angular/common";
import * as $ from 'jquery';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import {File, IWriteOptions, FileEntry} from '@ionic-native/file/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
declare var google;
@Component({
    selector: 'app-problem-details',
    templateUrl: './problem-details.page.html',
    styleUrls: ['./problem-details.page.scss'],
})
export class ProblemDetailsPage implements OnInit {
    projectId:any;
    taskId:any;
    problemId:any;
    viewInfo:any;
    problem:any;
    problemTabName = "problem-details";
    media:any;
    applicationUrl:any;
    geoOptions:GeolocationOptions;
    currentPos:Geoposition;

    constructor(private router:Router, private ar:ActivatedRoute, private projectService:ProjectService, private sharedService:SharedService,
                private urlService:URLService, private backNav:Location, private file:File, private camera:Camera,
                private geolocation:Geolocation, private filePath:FilePath) {
        this.problemId = this.sharedService.getValue().problemId;
        this.applicationUrl = this.urlService.viewInfo.restUrl;
        this.getLocation();
    }

    ngOnInit() {
        this.sharedService.showBusyIndicator();
        this.loadProblem();
        let height = $('#app-content').outerHeight();
        let height1 = $('#problemDetails-heading').outerHeight();
        $('#problemDetails-content').height(height - (height1));
    }

    selectProblemTab(tab) {
        this.problemTabName = tab;
        if (tab == "problem-details") {
            this.loadProblem();
        } else {
            this.loadMedia();
        }
    }

    loadProblem() {
        this.projectService.getProblemDetails(this.problemId).subscribe(
            (data:any)=> {
                this.problem = data;
                this.sharedService.hideBusyIndicator();
            }
        )
    }

    loadProblemNative() {
        this.projectService.getProblemDetailsNative(this.problemId).then(
            (data:any)=> {
                this.problem = JSON.parse(data.data);
                this.sharedService.hideBusyIndicator();
            }
        )
    }

    back() {
        this.backNav.back();
    }

    loadMedia() {
        this.projectService.getTaskMedia(this.problem.id).subscribe(
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
        this.projectService.getTaskMediaNative(this.problem.id).then(
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

    image:any;
    images = [];
    photos = [];

    takePicture(sourceType) {
        if (sourceType == "camera") {
            this.cameraOptions.sourceType = this.camera.PictureSourceType.CAMERA;
        } else {
            this.cameraOptions.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
        }

        this.camera.getPicture(this.cameraOptions).then((imageData) => {
            alert(imageData);
            this.selectedImage = (<any>window).Ionic.WebView.convertFileSrc(imageData);
            this.filePath.resolveNativePath(imageData).then(filePath => {
                //alert("File  Path : " + filePath);
                this.file.resolveLocalFilesystemUrl(filePath).then(fileInfo => {
                    let files = fileInfo as FileEntry;

                    files.file(success => {
                        //alert("File Name " + success.name);
                        this.selectedFile = success;
                        this.showPictureDialog();
                    });
                }, err => {
                    console.log(err);
                    throw err;
                });
            })
            /*this.file.resolveLocalFilesystemUrl(imageData).then((entry:FileEntry) => {
             entry.file(file => {
             this.selectedFile = file;
             this.showPictureDialog();
             });
             });*/
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
            formData.append('file', imgBlob, file.name);
            this.location.description = this.selectedImageDescription;
            this.projectService.uploadProjectMedia(this.problem.id, formData, this.location)
                .then((data) => {
                    this.selectedImage = null;
                    this.selectedImageDescription = null;
                    this.hideHistory();
                    this.loadMediaNative();
                    this.sharedService.hideBusyIndicator();
                    alert(data + " Uploaded Successfully");
                }, (err) => {
                    alert(err.err.message);
                    this.sharedService.hideBusyIndicator();
                });

        };
        reader.readAsArrayBuffer(file);
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

    showPictureDialog() {
        let modal = document.getElementById("problemImage-dialog");
        modal.style.display = "block";
        let height = $('#app-content').outerHeight();
        let footer = $('#problemImage-footer').outerHeight();

        let content = $('.problemImage-content').outerHeight();

        $("#problemPhoto-content").height(content - footer);
        let detailsHeight = $("#problemPhoto-content").outerHeight();
        $("#problemImages-view").height(detailsHeight);
    }

    hideHistory() {
        let modal = document.getElementById("problemImage-dialog");
        modal.style.display = "none";
    }

}
