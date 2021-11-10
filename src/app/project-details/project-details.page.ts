import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { SharedService } from '../services/shared.service';
import { ProjectService } from '../services/project.service';
import * as $ from 'jquery';
//import { Chart } from 'chart.js';
//import 'chartjs-plugin-labels';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import {File, IWriteOptions, FileEntry} from '@ionic-native/file/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation/ngx';
import { ActionSheetController } from '@ionic/angular';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { LoadingController } from '@ionic/angular';

declare var google;
@Component({
    selector: 'app-project-details',
    templateUrl: './project-details.page.html',
    styleUrls: ['./project-details.page.scss'],
})
export class ProjectDetailsPage implements OnInit {
    id:number;
    viewInfo:any;
    project:any;
    title:any;
    detailsView = "details";
    //@ViewChild('tasksView', {static: false}) tasksView;
    //@ViewChild('problemsView', {static: false}) problemsView;
    //private tasksChart:any;
    //private problemsChart:any;
    tabsTitle = "Details";
    comments:any;
    geoOptions:GeolocationOptions;
    currentPos:Geoposition;
    pageable = {
        page: 0,
        size: 1000
    };

    emptyComment = {
        objectType: "PROJECT",
        objectId: null,
        comment: ""
    };

    constructor(private router:Router, private ar:ActivatedRoute, private projectService:ProjectService,
                private sharedService:SharedService, private fileTransfer:FileTransfer, private file:File, private camera:Camera,
                private geolocation:Geolocation, public actionSheetController:ActionSheetController,
                private fileChooser:FileChooser, public loader:LoadingController) {
        this.viewInfo = this.sharedService.getValue();
        this.id = this.viewInfo.projectId;
        this.getLocation();
    }

    ngOnInit() {
        this.loadProjectNative();
    }

    loadProjectNative() {
        this.projectService.getProjectDetailsNative(this.id).then(
            (data:any)=> {
                this.project = JSON.parse(data.data);
            }
        )
    }

    loadProject() {
        this.projectService.getProjectDetails(this.id).subscribe(
            (data:any)=> {
                this.project = data;
            }
        )
    }

    showDetailsView(view) {
        this.detailsView = view;
    }

    tasksLabels = ["New", "Pending", "Finished"];
    tasksValues = [5, 4, 2];
    colors = ['#4286f4', '#44e83c', '#b1c4b0'];

    showDetails() {
        this.tabsTitle = "Details";
        this.router.navigate(['project/' + this.id + "/details"]);
    }

    showTasks() {
        this.tabsTitle = "Tasks";
        this.sharedService.setProjectIcons(true);
        this.sharedService.setTaskIcons(false);
        this.sharedService.setTasksView(true);
        this.router.navigate(['project/' + this.id + "/tasks"]);
    }

    showSites() {
        this.tabsTitle = "Sites";
        this.sharedService.setSitesView(true);
        this.router.navigate(['project/' + this.id + "/sites"]);
    }

    showProblems() {
        this.tabsTitle = "Problems";
        this.sharedService.setProblemsView(true);
        this.sharedService.setProjectIcons(false);
        this.router.navigate(['project/' + this.id + "/problems"]);
    }

    showMedia() {
        this.tabsTitle = "Media";
        this.sharedService.setProjectIcons(true);
        this.sharedService.setTaskIcons(false);
        this.router.navigate(['project/' + this.id + "/media"]);
    }

    /*loadCharts() {
     let theHelp = Chart.helpers;
     this.tasksChart = new Chart(this.tasksView.nativeElement, {
     type: "doughnut",
     data: {
     labels: this.tasksLabels,
     datasets: [
     {
     label: "Tasks",
     data: this.tasksValues,
     backgroundColor: this.colors,
     hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56",]
     }
     ]
     },
     options: {
     legend: {
     position: 'bottom',
     display: true,
     labels: {
     generateLabels: function (chart) {
     var data = chart.data;
     var values = data.datasets[0].data;
     var total = 0;
     values.forEach(value => {
     total = total + value;
     })

     if (data.labels.length && data.datasets.length) {
     return data.labels.map(function (label, i) {
     var meta = chart.getDatasetMeta(0);
     var ds = data.datasets[0];
     var arc = meta.data[i];
     var custom = arc && arc.custom || {};
     var getValueAtIndexOrDefault = theHelp.getValueAtIndexOrDefault;
     var arcOpts = chart.options.elements.arc;
     var percent = String(Math.round(ds.data[i] / total * 100)) + "%";
     var fill = custom.backgroundColor ? custom.backgroundColor : getValueAtIndexOrDefault(ds.backgroundColor, i, arcOpts.backgroundColor);
     var stroke = custom.borderColor ? custom.borderColor : getValueAtIndexOrDefault(ds.borderColor, i, arcOpts.borderColor);
     var bw = custom.borderWidth ? custom.borderWidth : getValueAtIndexOrDefault(ds.borderWidth, i, arcOpts.borderWidth);
     return {
     // And finally :
     text: label + " : " + percent,
     fillStyle: fill,
     strokeStyle: stroke,
     lineWidth: bw,
     hidden: isNaN(ds.data[i]) || meta.data[i].hidden,
     index: i
     };
     });
     }
     return [];
     }
     }
     },
     percentageInnerCutout: 80,
     aspectRatio: 1,
     responsive: true,
     plugins: {
     labels: [
     {
     render: 'value',
     position: 'inside'
     }
     ]
     }
     }
     });
     }*/

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

    readFile(file:any) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const imgBlob = new Blob([reader.result], {
                type: file.type
            });
            const formData = new FormData();
            formData.append('name', 'Hello');
            formData.append('file', imgBlob, file.name);
            this.projectService.uploadProjectMedia(this.id, formData, this.location)
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

    loaderToShow:any;
    options:any = {message: "Loading", duration: 5000};

    showLoader() {
        this.loaderToShow = this.loader.create(this.options).then((res) => {
            res.present();
        });

    }

    hideLoader() {
        this.loader.dismiss();
    }

    showComments() {

        this.showLoader();
        this.projectService.getProjectComments(this.id, "PROJECT", this.pageable).subscribe(
            (data:any)=> {
                this.comments = data;
                this.showCommentsView();
                this.hideLoader();
            }
        )

        /*this.projectService.getProjectCommentsNative(this.id, "PROJECT", this.pageable).then(
         (data:any)=> {
         this.comments = JSON.parse(data.data);
         this.showCommentsView();
         this.hideLoader();
         }
         )*/
    }

    showCommentsView() {
        let modal = document.getElementById("project-comments");
        modal.style.display = "block";
        let height = $('#app-content').outerHeight();
        let height2 = $('#project-header').outerHeight();
        let projectIcons = $('#projectIcons').outerHeight();

        $("#project-comments").height(height);

        /*let modal1 = document.getElementById("project-comments");
         modal1.style.marginTop = height2 + "px";*/

        let header = $("#details-header").outerHeight();
        let content = $('.modal-content').outerHeight();
        let footer = $('#footer').outerHeight();

        $("#details-content").height(content - header);
        let detailsHeight = $("#details-content").outerHeight();
        $("#comments").height(detailsHeight - footer);
    }

    hideHistory() {
        let modal = document.getElementById("project-comments");
        modal.style.display = "none";
        this.comments = [];
    }

    createComment() {
        if (this.emptyComment.comment != "" && this.emptyComment.comment != null && this.emptyComment.comment != undefined) {
            this.showLoader();
            this.emptyComment.objectId = this.id;
            this.projectService.createComment(this.emptyComment).subscribe(
                (data:any)=> {
                    this.loadComments();
                }, (error)=> {
                    this.hideLoader();
                }
            )

            /*this.projectService.createCommentNative(this.emptyComment).then(
             (data:any)=> {
             this.loadCommentsNative();
             }, (error)=> {
             this.hideLoader();
             }
             )*/
        }
    }

    loadComments() {
        this.projectService.getProjectComments(this.id, "PROJECT", this.pageable).subscribe(
            (data:any)=> {
                this.comments = data;
                this.emptyComment = {
                    objectType: "PROJECT",
                    objectId: null,
                    comment: ""
                };
                this.hideLoader();
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
                this.hideLoader();
            }
        )
    }

    /*async

     selectImage() {
     let actionSheet = await
     this.actionSheetController.create({
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
}
