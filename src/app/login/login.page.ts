import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { LoginService } from '../services/login.service';
import { SharedService } from '../services/shared.service';
import { URLService } from '../services/url.service';
import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';


@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    constructor(private router:Router, private loginService:LoginService, private sharedService:SharedService,
                private urlService:URLService, private httpClient:HttpClient) {
    }

    ngOnInit() {

    }

    hasError = false;
    errorMessage = null;
    loggingIn = false;

    loginDto = {
        login: {
            loginName: "admin",
            password: "cassini",
            person: null,
            id: null,
            isActive: false,
            external: false,
            oldPassword: null,
            newPassword: null,
            flag: false
        }
    };

    loginDto1 = {
        login: {
            loginName: "admin@irstelo",
            password: "Ramana$1963",
            person: null,
            id: null,
            isActive: false,
            external: false,
            oldPassword: null,
            newPassword: null,
            flag: false
        }
    };

    performLogin() {
        if (this.validateLogin()) {
            this.loggingIn = true;
            this.sharedService.showBusyIndicator();
            this.loginService.login(this.loginDto).subscribe(
                (data:any)=> {
                    this.sharedService.setLoginDetails(data.session.login);
                    this.loggingIn = false;
                    this.router.navigate(['/home']);
                }, (error:any)=> {
                    this.loggingIn = false;
                    this.hasError = true;
                    this.errorMessage = error.error.message;
                    alert("Status : " + error.status);
                    alert("Error : " + error.error);
                    alert("Error Message : " + error.error.message);
                    alert("Message : " + error.message);
                    this.sharedService.hideBusyIndicator();
                }
            )
        }
    }

    /*performLogin1() {
     if (this.validateLogin()) {
     this.loggingIn = true;
     this.loginService.login1(this.loginDto1).subscribe(
     (data:any)=> {
     this.sharedService.setLoginDetails(data.session.login);
     this.loggingIn = false;
     alert("IRSTE Login Success");
     this.router.navigate(['/home']);
     }, (error:any)=> {
     this.loggingIn = false;
     this.hasError = true;
     this.errorMessage = error.error.message;
     alert("Status : " + error.status);
     alert("Error : " + error.error);
     alert("Error Message : " + error.error.message);
     alert("Message : " + error.message);
     }
     )
     }
     }*/

    performIonicHttpLogin() {

        this.loginService.loginNative(this.loginDto).then(
            (data:any)=> {
                let sessionObject = JSON.parse(data.data);
                this.sharedService.setLoginDetails(sessionObject.session.login);
                this.loggingIn = false;
                this.router.navigate(['/home']);
            }, (error:any)=> {
                this.loggingIn = false;
                this.hasError = true;
                this.errorMessage = error.error.message;
                //alert("Status : " + error.status);
                //alert("Error : " + error.error);
                //alert("Error Message : " + error.error.message);
                //alert("Message : " + error.message);
            }
        );

        /*this.http.post('http://192.168.0.107:8084/api/security/login/validate', this.loginDto, headers)
         .then((data:any) => {
         let sessionObject = JSON.parse(data.data);
         this.sharedService.setLoginDetails(sessionObject.session.login);
         this.router.navigate(['/home']);
         })
         .catch((error:any) => {
         alert("Status : " + error.status);
         alert("Error Message : " + error.error.message);
         alert("Message : " + error.message);
         alert("Error : " + error.error);
         console.log(error.status);
         console.log(error.error); // error message as string
         console.log(error.headers);

         }
         );*/

        /*this.http.post('http://192.168.0.107:8084/api/security/login/validate', this.loginDto, headers)
         .then((data:any) => {
         this.http.getDataSerializer();
         alert("Native Login Success");
         alert(data.session);
         console.log(data.status);
         console.log(data.data); // data received by server
         console.log(data.headers);
         this.router.navigate(['/home']);
         })
         .catch(error => {
         alert("Status : " + error.status);
         alert("Error Message : " + error.error.message);
         alert("Message : " + error.message);
         alert("Error : " + error.error);
         console.log(error.status);
         console.log(error.error); // error message as string
         console.log(error.headers);

         });*/
    }

    validateLogin() {
        let valid = true;

        if (this.loginDto.login.loginName == null || this.loginDto.login.loginName == "") {
            valid = false;
            this.hasError = true;
            this.errorMessage = "Please enter Username";
        } else if (this.loginDto.login.password == null || this.loginDto.login.password == "") {
            valid = false;
            this.hasError = true;
            this.errorMessage = "Please enter Password";
        }

        setTimeout(()=> {
            this.hasError = false;
        }, 2000);

        return valid;
    }

}
