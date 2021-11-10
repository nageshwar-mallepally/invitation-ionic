import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URLService } from './url.service';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    headers;

    constructor(public httpClient:HttpClient, public http:HTTP, private urlservice:URLService) {
        this.headers = new HttpHeaders();
        this.headers.append('Access-Control-Allow-Headers', 'Authorization');
        this.headers.append('Access-Control-Allow-Origin', 'http://localhost:8080');
        this.headers.append('Access-Control-Allow-Credentials', 'true');
    }

    public current() {
        return this.httpClient.get(this.urlservice.viewInfo.restUrl + "api/security/session/current?bust=" + (new Date()).getTime());
    }

    /*login(login) {
        //const headers  = new HttpHeaders().set('Access-Control-Allow-Origin', '*');
        //const headers = new HttpHeaders().set('Access-Control-Allow-Credentials', 'true').set('Content-Type', 'application/json; charset=utf-8')
        //    .set('Access-Control-Allow-Origin', '*').set('Access-Control-Allow-Method', 'GET');
        //return this.httpClient.post(this.urlservice.viewInfo.restUrl + "api/security/login/validate", login, {headers: this.headers});
        return this.httpClient.post(this.urlservice.viewInfo.restUrl + "api/security/login/validate", login);
        //return this.httpClient.get(this.urlservice.viewInfo.restUrl + "users", {headers : this.headers});
        //return this.httpClient.get("/users", {headers: this.headers});
    }*/

    login(login) {
     return this.httpClient.post(this.urlservice.viewInfo.restUrl + "api/security/login/validate", login);
     }

    /*login1(login) {
        return this.httpClient.post(this.urlservice.viewInfo.restUrl1 + "api/security/login/validate", login);
    }*/

    logout() {
        return this.httpClient.get(this.urlservice.viewInfo.restUrl + "api/security/logout");
    }

    /*changePassword(loginDto) {
     return this.httpClient.post(this.urlservice.viewInfo.restUrl + "api/security/login/changepassword", loginDto);
     }

     resetPassword(resetDto) {
     return this.httpClient.post(this.urlservice.viewInfo.restUrl + "api/security/login/resetpwd", resetDto);
     }

     verifyOtp(resetDto) {
     return this.httpClient.post(this.urlservice.viewInfo.restUrl + "api/security/login/resetpwd/verify", resetDto);
     }

     setNewPassword(passwordDto) {
     return this.httpClient.post(this.urlservice.viewInfo.restUrl + "api/security/login/newpassword", passwordDto);
     }*/

    loginNative(loginDto) {
        this.http.setDataSerializer('json');
        return this.http.post(this.urlservice.viewInfo.restUrl + 'api/security/login/validate', loginDto, this.urlservice.headers);
    }

}
