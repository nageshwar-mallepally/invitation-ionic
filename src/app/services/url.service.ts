import { Injectable,OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class URLService {

    viewInfo = {
        //restUrl: "http://192.168.0.118:8084/",
        //restUrl: "http://localhost:8080/",
        restUrl: "",
        restUrll: "https://irstelicensing.org.in/"
    };

    headers = {
        "Content-Type": "application/json",
        'Accept': 'application/json',
        "cache-control": "no-cache",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token, Accept, Authorization, X-Request-With, Access-Control-Request-Method, Access-Control-Request-Headers",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT, OPTIONS, TRACE, PATCH, CONNECT",
    };

    fileHeaders = {
        'enctype': 'multipart/form-data;',
        'Accept': 'plain/text',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
        'Access-Control-Allow-Headers': 'Authorization, Origin, Content-Type, X-CSRF-Token'
    };

    constructor(private router:Router, private http:HttpClient) {
        // this.getApiUrl();
    }

}
