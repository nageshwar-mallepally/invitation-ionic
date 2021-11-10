import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { SharedService } from '../../services/shared.service';
import { ProjectService } from '../../services/project.service';
import { URLService } from '../../services/url.service';

@Component({
    selector: 'app-media',
    templateUrl: './media.page.html',
    styleUrls: ['./media.page.scss'],
})
export class MediaPage implements OnInit {
    id:any;
    viewInfo:any;
    media:any;
    pageable = {
        page: 0,
        size: 10,
        sort: {
            field: "modifiedDate",
            order: "DESC"
        }
    };
    applicationUrl:any;

    constructor(private ar:ActivatedRoute, private projectService:ProjectService, private sharedService:SharedService, private urlShervice:URLService) {
        this.viewInfo = this.sharedService.getValue();
        this.id = this.viewInfo.projectId;
        this.applicationUrl = this.urlShervice.viewInfo.restUrl;
    }

    ngOnInit() {
        this.loadMedia();
    }

    ionViewWillEnter() {
        this.loadMedia();
    }

    loadMedia() {
        this.projectService.getProjectMedia(this.id, this.pageable).subscribe(
            (data:any)=> {
                this.media = data;
                for (let i = 0; i < this.media.length; i++) {
                    let media = this.media[i];
                    media.src = this.applicationUrl + "/api/col/media/" + media.id + "/bytes"
                }
            }
        )
    }

    loadMediaNative() {
        this.projectService.getProjectMediaNative(this.id, this.pageable).then(
            (data:any)=> {
                this.media = JSON.parse(data.data);
                for (let i = 0; i < this.media.length; i++) {
                    let media = this.media[i];
                    media.src = this.applicationUrl + "/api/col/media/" + media.id + "/bytes"
                }
            }
        )
    }
}
