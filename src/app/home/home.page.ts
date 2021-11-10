import { Component,OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { ProjectService } from '../services/project.service';
import { SharedService } from '../services/shared.service';
import { LoginService } from '../services/login.service';
import { HTTP,HTTPResponse } from '@ionic-native/http/ngx';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import {DatePipe} from '@angular/common';
import {cloneDeep} from 'lodash';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation/ngx';
import { ActionSheetController } from '@ionic/angular';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import {File, IWriteOptions, FileEntry} from '@ionic-native/file/ngx';
import * as $ from 'jquery';
@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    invitations:any;
    title = "Invitations";

    constructor(private router:Router, private projectService:ProjectService, private sharedService:SharedService, private http:HTTP,
                private loginService:LoginService, private datePicker:DatePicker, private datePipe:DatePipe,private camera:Camera,
                private geolocation:Geolocation, private fileChooser:FileChooser, private filePath:FilePath, private file:File) {
    }

    ngOnInit() {
        this.sharedService.showBusyIndicator();
        this.loadInvitations();
        let height = $('#app-content').outerHeight();
        let height1 = $('#home-heading').outerHeight();
        $('#home-content').height(height - (height1));
    }

    cameraOptions:CameraOptions = {
        quality: 20,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true
    }

    emptyInvitation = {
        id: null,
        name: null,
        information: null,
        dateTime: null,
        phoneNumber: null,
        email: null,
        address: null,
        invitedBy: null
    }

    newInvitation = {
        id: null,
        name: null,
        information: null,
        dateTime: null,
        phoneNumber: null,
        email: null,
        address: null,
        invitedBy: null
    }

    /*loadPortfoliosNative() {
     this.projectService.getAllPortfoliosNative()
     .then(data => {
     this.invitations = JSON.parse(data.data);
     this.sharedService.hideBusyIndicator();
     })
     .catch(error => {
     alert("Status : " + error.status);
     alert("Error Message : " + error.error.message);
     alert("Message : " + error.message);
     alert("Error : " + error.error);
     console.log(error.status);
     console.log(error.error); // error message as string
     console.log(error.headers);
     this.sharedService.hideBusyIndicator();

     }
     );
     }*/
    pageable = {
        page: 0,
        size: 10,
        sort: {
            field: "modifiedDate",
            order: "DESC"
        }
    };

    loadAllInvitations() {
        this.projectService.getAllInvitations().subscribe(
            (data:any)=> {
                this.invitations = data;
                this.sharedService.hideBusyIndicator();
            }, (error:any)=> {
                alert(error.error.message);
                this.sharedService.hideBusyIndicator();
            }
        )
    }

    loadInvitations() {
        this.projectService.getInvitations(this.pageable).subscribe(
            (data:any)=> {
                this.invitations = data;
                this.sharedService.hideBusyIndicator();
            }, (error:any)=> {
                alert(error.error.message);
                this.sharedService.hideBusyIndicator();
            }
        )
    }

    openInvitation(invitation) {
        this.sharedService.setInvitationId(invitation.id);
        this.router.navigate(['invitation/' + invitation.id]);
    }


    addInvitation() {
        this.newInvitation = cloneDeep(this.emptyInvitation);
        if (this.sharedService.viewInfo.loginDetails != null && this.sharedService.viewInfo.loginDetails.person != undefined) {
            this.newInvitation.invitedBy = this.sharedService.viewInfo.loginDetails.person.id;
        } else {
            this.newInvitation.invitedBy = 1;
        }
        let modal = document.getElementById("new-invitation");
        modal.style.display = "block";
        let height = $('#app-content').outerHeight();
        let header = $('#new-invitation-header').outerHeight();
        $("#new-invitation-content").height(height - header * 2);
    }

    hasError = false;
    errorMessage = "";

    validateInvitation() {
        let valid = true;

        if (this.newInvitation.name == null || this.newInvitation.name.trim() == "" || this.newInvitation.name == undefined) {
            valid = false;
            this.hasError = true;
            this.errorMessage = "Please Enter Invitation Name";
        }
        else if (this.newInvitation.information == null || this.newInvitation.information.trim() == "" || this.newInvitation.information == undefined) {
            valid = false;
            this.hasError = true;
            this.errorMessage = "Please Enter Invitation Information";
        }
        else if (this.newInvitation.phoneNumber == null || this.newInvitation.phoneNumber.trim() == "" || this.newInvitation.phoneNumber == undefined) {
            valid = false;
            this.hasError = true;
            this.errorMessage = "Please Enter Phone Number";
        }
        else if (this.newInvitation.address == null || this.newInvitation.address.trim() == "" || this.newInvitation.address == undefined) {
            valid = false;
            this.hasError = true;
            this.errorMessage = "Please Enter Address";
        }
        else if (this.newInvitation.dateTime == null || this.newInvitation.dateTime.trim() == "" || this.newInvitation.dateTime == undefined) {
            valid = false;
            this.hasError = true;
            this.errorMessage = "Please Select Invitation Date and Time";
        }

        setTimeout(()=> {
            this.hasError = false;
            this.errorMessage = "";
        }, 6000);

        return valid;
    }

    createInvitation() {
        if (this.validateInvitation()) {
            let temp = this.newInvitation.dateTime;
            this.newInvitation.dateTime = this.datePipe.transform(this.newInvitation.dateTime, "MM/dd/yyyy hh:mm:ss aa");
            this.projectService.createInvitation(this.newInvitation).subscribe(
                (data:any)=> {
                    this.loadInvitations();
                    this.hideNewInvitation();
                }, (error:any)=> {
                    this.newInvitation.dateTime = temp;
                }
            )
        }
    }

    hideNewInvitation() {
        let modal = document.getElementById("new-invitation");
        modal.style.display = "none";
        //this.sharedService.setProjectIcons(true);
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
    selectedImage = null;
    selectedImageDescription = null;
    selectedFile = null;
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

    sendEmailTo(email){

    }

    callToNumber(number){
        setTimeout(() => {
            let tel = number;
            window.open(`tel:${tel}`, '_system');
        },100);
    }

    /*selectInvitationDate() {
     this.datePicker.show({
     date: new Date(),
     mode: 'date',
     androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
     }).then(
     (date) => {
     this.newInvitation.date = this.datePipe.transform(date, "dd/MM/yyyy");
     alert('Got date: ' + date);
     },
     (err) => {
     console.log('Error occurred while getting date: ', err)
     }
     )
     ;
     }*/

    logout() {
        this.sharedService.showBusyIndicator();
        this.loginService.logout().subscribe(
            (data:any)=> {
                this.router.navigate(['login']);
                this.sharedService.hideBusyIndicator();
            }, (error:any)=> {
                this.sharedService.hideBusyIndicator();
            }
        )
    }
}
