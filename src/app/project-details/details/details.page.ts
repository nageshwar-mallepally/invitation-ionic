import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { SharedService } from '../../services/shared.service';
import { ProjectService } from '../../services/project.service';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Component({
    selector: 'app-details',
    templateUrl: './details.page.html',
    styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
    id:any;
    viewInfo:any;
    project:any;

    constructor(private route:ActivatedRoute, private projectService:ProjectService, private sharedService:SharedService,
                private callNumber:CallNumber, private androidPermissions:AndroidPermissions) {
        this.viewInfo = this.sharedService.getValue();
        this.id = this.viewInfo.projectId;
    }

    ngOnInit() {
        this.loadProject();
    }

    ionViewWillEnter() {
        this.loadProject();
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
                }, 100)
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
                }, 100)
            }
        )
    }

    /*callToUser() {

        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CALL_PHONE).then(
                success => {
                if (!success.hasPermission) {
                    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CALL_PHONE).
                        then((success) => {
                            //alert('hi')
                            this.callNumber.callNumber(this.project.phoneNumber, true)
                                .then(res => console.log('Launched dialer 1' + res))
                                .catch(err => console.log('Error after request 1' + err));
                        },
                        (err) => {
                            //alert("error1")
                            //alert("Error after request 1");
                        });
                } else {
                    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CALL_PHONE).
                        then((success) => {
                            //alert('hi')
                            this.callNumber.callNumber(this.project.phoneNumber, true)
                                .then(res => console.log('Launched dialer 1.1' + res))
                                .catch(err => console.log('Error after request 1.1' + err));
                        },
                        (err) => {
                            //alert("error1")
                            //alert("Error after request 1.1");
                        });
                }
            },
                err => {
                this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CALL_PHONE).
                    then((success) => {
                        //alert('success')
                        this.callNumber.callNumber(this.project.phoneNumber, true)
                            .then(res => console.log('Launched dialer 2' + res))
                            .catch(err => console.log('Error after request 2 ' + err));
                    },
                    (err) => {
                        //alert('error2')
                        //alert("Error after request 2");
                        this.callNumber.callNumber(this.project.phoneNumber, true)
                            .then(res => console.log('Launched dialer 2.1' + res))
                            .catch(err => console.log('Error after request 2.1' + err));
                    });
            }
        );
    }

    callToPerson() {
        this.callNumber.isCallSupported()
            .then(function (response) {
                if (response == true) {
                    this.callNumber.callNumber(this.project.phoneNumber, true)
                        .then(res => console.log('Launched dialer!' + res))
                        .catch(err => console.log('Error launching dialer' + err));
                }
                else {
                    //alert("Not supporting")
                    this.callToUser();
                }
            })
            .catch((err) => {
                //alert('Not supporting dialer' + err);
                this.callToUser();
            });
    }*/

    callToNumber(number){
        setTimeout(() => {
            let tel = number;
            window.open(`tel:${tel}`, '_system');
        },100);
    }

}
