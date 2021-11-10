import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { SharedService } from '../../services/shared.service';
import { ProjectService } from '../../services/project.service';
import { URLService } from '../../services/url.service';

import {File, IWriteOptions, FileEntry} from '@ionic-native/file/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation/ngx';
import * as $ from 'jquery';
declare var google;
@Component({
    selector: 'app-problems',
    templateUrl: './problems.page.html',
    styleUrls: ['./problems.page.scss'],
})
export class ProblemsPage implements OnInit {

    id:any;
    viewInfo:any;
    problems:any;
    tabName = "details";
    pageable = {
        page: 0,
        size: 10,
        sort: {
            field: "modifiedDate",
            order: "DESC"
        }
    };
    applicationUrl:any;
    problem:any;
    media:any;
    geoOptions:GeolocationOptions;
    currentPos:Geoposition;
    projectPersons:any;
    types:any;

    constructor(private ar:ActivatedRoute, private projectService:ProjectService, private sharedService:SharedService,
                private urlShervice:URLService, private file:File, private camera:Camera,
                private geolocation:Geolocation) {
        this.viewInfo = this.sharedService.getValue();
        this.id = this.viewInfo.projectId;
        this.applicationUrl = this.urlShervice.viewInfo.restUrl;
        this.getLocation();
    }

    ngOnInit() {
        this.loadProblems();
    }

    ionViewWillEnter() {
        this.loadProblems();
    }

    loadProblems() {
        this.projectService.getProjectProblems(this.id).subscribe(
            (data:any)=> {
                this.problems = data;
            }
        )
    }

    loadProblemsNative() {
        this.projectService.getProjectProblemsNative(this.id).then(
            (data:any)=> {
                this.problems = JSON.parse(data.data);
            }
        )
    }

    problemsView() {
        this.sharedService.setProblemsView(true);
    }

    newProblem = {
        id: null,
        targetObjectId: null,
        targetObjectType: "PROJECT",
        type: null,
        priority: null,
        title: null,
        description: null,
        status: "NEW",
        assignedTo: null,
        task: null
    }

    newProblemView() {
        let modal = document.getElementById("new-problem");
        modal.style.display = "block";
        let height = $('#app-content').outerHeight();

        this.loadProjectTeam();
        this.loadIssueTypes();
    }

    hideProblem() {
        let modal = document.getElementById("new-problem");
        modal.style.display = "none";
    }

    loadIssueTypes() {
        this.projectService.getIssueTypes().subscribe(
            (data:any)=> {
                this.types = data;
            }
        )
    }

    priorities = ["LOW", "MEDIUM", "HIGH"];

    loadProjectTeam() {
        this.projectService.getProjectTeam(this.id).subscribe(
            (data:any)=> {
                this.projectPersons = data;
            }
        )
    }

    openProblem(problem) {
        this.sharedService.setProblemsView(false);
        let height = $('#app-content').outerHeight();
        let height2 = $('#project-header').outerHeight();
        $('#problemDetails').height(height - (height2 * 3));
        this.loadProblemDetails(problem);
        this.viewInfo.showProjectIcons = false;
        this.viewInfo.showTaskIcons = false;
        this.sharedService.setProjectIcons(false);
    }

    loadProblemDetails(problem) {
        this.projectService.getProblemDetails(problem.id).subscribe(
            (data:any)=> {
                this.problem = data;
            }
        )
    }

    loadProblemDetailsNative(problem) {
        this.projectService.getProblemDetailsNative(problem.id).then(
            (data:any)=> {
                this.problem = JSON.parse(data.data);
            }
        )
    }

    showProblemDetails() {
        this.tabName = "details";
    }

    showProblemMedia() {
        this.tabName = "media";
        this.loadProblemMedia();
    }

    loadProblemMedia() {
        this.projectService.getProblemMedia(this.problem.id).subscribe(
            (data:any)=> {
                this.media = data;
                for (let i = 0; i < this.media.length; i++) {
                    let media = this.media[i];
                    media.src = this.applicationUrl + "/api/col/media/" + media.id + "/bytes"
                }
            }
        )
    }

    loadProblemMediaNative() {
        this.projectService.getProblemMediaNative(this.problem.id).then(
            (data:any)=> {
                this.media = JSON.parse(data.data);
                for (let i = 0; i < this.media.length; i++) {
                    let media = this.media[i];
                    media.src = this.applicationUrl + "/api/col/media/" + media.id + "/bytes"
                }
            }
        )
    }

    takePicture() {
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

    location = {
        latitude: null,
        longitude: null,
        uploadFrom: null,
        description: null
    };

    cameraOptions:CameraOptions = {
        quality: 20,
        sourceType: this.camera.PictureSourceType.CAMERA,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true
    }

    readFile(file:any) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const imgBlob = new Blob([reader.result], {
                type: file.type
            });
            const formData = new FormData();
            formData.append('name', 'Hello');
            formData.append('file', imgBlob, file.name);
            this.projectService.uploadProjectMedia(this.problem.id, formData, this.location)
                .then((data) => {
                    alert(data + " Uploaded Successfully");
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

    createProblem() {
        if (this.validateProblem()) {
            this.newProblem.assignedTo = this.newProblem.assignedTo.id;
            this.newProblem.targetObjectId = this.id;
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

}
