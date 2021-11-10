import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLService } from './url.service';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {

    constructor(public httpClient:HttpClient, public http:HTTP, private urlservice:URLService) {

    }

    public getAllInvitations() {
        return this.httpClient.get(this.urlservice.viewInfo.restUrl + "/api/common/invitations/all");
    }

    public getInvitations(pageable) {
        //this.http.getDataSerializer();
        let add = this.urlservice.viewInfo.restUrl + "/api/common/invitations?page=" + pageable.page + "&size=" + pageable.size + "&sort=" + pageable.sort.field + ":" + pageable.sort.order;
        return this.httpClient.get(add);
    }

    public getInvitationDetails(id){
        let add = this.urlservice.viewInfo.restUrl + "/api/common/invitations/"+id;
        return this.httpClient.get(add);
    }

    public getAllPortfoliosNative() {
        this.http.getDataSerializer();
        return this.http.get(this.urlservice.viewInfo.restUrl + "api/portfolio/all", {}, {});
    }

    public getPortfolioProjectsNative(id) {
        this.http.getDataSerializer();
        return this.http.get(this.urlservice.viewInfo.restUrl + "api/portfolio/" + id + "/projects", {}, {});
    }

    public getProjectDetailsNative(id) {
        this.http.getDataSerializer();
        return this.http.get(this.urlservice.viewInfo.restUrl + "api/projects/" + id + "/details", {}, {});
    }

    getProjectMediaNative(id, pageable) {
        this.http.getDataSerializer();
        return this.http.get(this.urlservice.viewInfo.restUrl + "api/projects/" + id + "/all/media?page=" + pageable.page + "&size=" + pageable.size, {}, {});
    }

    getProjectTasksNative(projectId) {
        this.http.getDataSerializer();
        return this.http.get(this.urlservice.viewInfo.restUrl + "api/projects/" + projectId + "/tasks/total", {}, {});
    }

    getProjectProblemsNative(id) {
        this.http.getDataSerializer();
        return this.http.get(this.urlservice.viewInfo.restUrl + "api/projects/" + id + "/problems", {}, {});
    }

    getProjectSitesNative(id, pageable) {
        this.http.getDataSerializer();
        return this.http.get(this.urlservice.viewInfo.restUrl + "api/sites/byProject/pageable/" + id + "?page=" + pageable.page + "&size=" + pageable.size + "&sort=" + pageable.sort.field + ":" + pageable.sort.order, {}, {});
    }

    getTaskFilesNative(projectId, taskId) {
        this.http.getDataSerializer();
        return this.http.get(this.urlservice.viewInfo.restUrl + "api/projects/" + projectId + "/tasks/" + taskId + "/latestFiles", {}, {});
    }

    getTaskMediaNative(id) {
        this.http.getDataSerializer();
        return this.http.get(this.urlservice.viewInfo.restUrl + "api/col/media/object/" + id, {}, {});
    }

    getTaskProblemsNative(id, taskId) {
        this.http.getDataSerializer();
        return this.http.get(this.urlservice.viewInfo.restUrl + "api/projects/" + id + "/tasks/" + taskId + "/problems", {}, {});
    }

    getTaskNative(projectId, taskId) {
        this.http.getDataSerializer();
        return this.http.get(this.urlservice.viewInfo.restUrl + "api/projects/" + projectId + "/tasks/" + taskId, {}, {});
    }

    public getAllProjects() {
        return this.httpClient.get(this.urlservice.viewInfo.restUrl + "api/projects");
    }

    public getPortfolioProjects(id) {
        return this.httpClient.get(this.urlservice.viewInfo.restUrl + "api/portfolio/" + id + "/projects");
    }

    public getProjectsByPerson(id) {
        return this.httpClient.get(this.urlservice.viewInfo.restUrl + "api/projects/persons/" + id);
    }

    public getProject(id) {
        return this.httpClient.get(this.urlservice.viewInfo.restUrl + "api/projects/" + id);
    }

    public getProjectDetails(id) {
        return this.httpClient.get(this.urlservice.viewInfo.restUrl + "api/projects/" + id + "/details");
    }


    getProjectSites(id, pageable) {
        return this.httpClient.get(this.urlservice.viewInfo.restUrl + "api/sites/byProject/pageable/" + id + "?page=" + pageable.page + "&size=" + pageable.size + "&sort=" + pageable.sort.field + ":" + pageable.sort.order);
    }

    /*public getProjectTasks(id, pageable, criteria) {
     var url = "api/projects/" + id + "/tasks/filters";
     url += "?name=" + criteria.name + "&description=" + criteria.description + "&site=" + criteria.site + "&person=" + criteria.person + "&wbsItem=" + criteria.wbsItem + "&status=" + criteria.status + "&percentComplete=" + criteria.percentComplete + "&plannedStartDate=" + criteria.plannedStartDate + "&plannedFinishDate=" + criteria.plannedFinishDate + "&actualStartDate=" + criteria.actualStartDate + "&actualFinishDate=" + criteria.actualFinishDate + "&inspectedBy=" + criteria.inspectedBy + "&inspectedOn=" + criteria.inspectedOn + "&inspectionResult=" + criteria.inspectionResult + "&subContract=" + criteria.subContract + "&delayTask=" + criteria.delayTask;
     url += "&page=" + pageable.page + "&size=" + pageable.size + "&sort=" + pageable.sort.field + ":" + pageable.sort.order;
     return this.httpClient.get(this.urlservice.viewInfo.restUrl + url);
     }*/

    getProjectMedia(id, pageable) {
        return this.httpClient.get(this.urlservice.viewInfo.restUrl + "api/projects/" + id + "/all/media?page=" + pageable.page + "&size=" + pageable.size);
    }

    getTaskMedia(id) {
        return this.httpClient.get(this.urlservice.viewInfo.restUrl + "api/col/media/object/" + id);
    }

    getProjectProblems(id) {
        return this.httpClient.get(this.urlservice.viewInfo.restUrl + "api/projects/" + id + "/problems");
    }

    getTaskProblems(id, taskId) {
        return this.httpClient.get(this.urlservice.viewInfo.restUrl + "api/projects/" + id + "/tasks/" + taskId + "/problems");
    }

    getTaskFiles(projectId, taskId) {
        return this.httpClient.get(this.urlservice.viewInfo.restUrl + "api/projects/" + projectId + "/tasks/" + taskId + "/latestFiles");
    }

    /*getProjectProblems(objectType, objectId, pageable) {
     var url = "api/issues/pageable?targetObjectType=" + objectType + "&targetObjectId=" + objectId;
     url += "&page=" + pageable.page + "&size=" + pageable.size + "&sort=" + pageable.sort.field;
     return this.httpClient.get(this.urlservice.viewInfo.restUrl + url);
     }*/

    getTask(projectId, taskId) {
        return this.httpClient.get(this.urlservice.viewInfo.restUrl + "api/projects/" + projectId + "/tasks/" + taskId);
    }

    getProjectTasks(projectId) {
        return this.httpClient.get(this.urlservice.viewInfo.restUrl + "api/projects/" + projectId + "/tasks/total");
    }

    uploadProjectMedia(projectId, file, location) {
        this.http.setDataSerializer('multipart');
        return this.http.post(this.urlservice.viewInfo.restUrl + "api/col/media/object/" + projectId + "?latitude=" + location.latitude
            + "&longitude=" + location.longitude + "&uploadFrom=" + location.uploadFrom + "&description=" + location.description, file, {});
    }

    uploadTaskFiles(projectId, taskId, file) {
        this.http.setDataSerializer('multipart');
        return this.http.post(this.urlservice.viewInfo.restUrl + "api/projects/" + projectId + "/tasks/" + taskId + "/upload/files", file, {});
    }

    uploadFolderFiles(projectId, folderId, file) {
        this.http.setDataSerializer('multipart');
        return this.http.post(this.urlservice.viewInfo.restUrl + "api/projects/" + projectId + "/folders/" + folderId + "/documents", file, {});
    }

    getProjectComments(projectId, objectType, pageable) {
        return this.httpClient.get(this.urlservice.viewInfo.restUrl + "api/col/comments?objectType=" + objectType + "&objectId=" + projectId + "&page=" + pageable.page + "&size=" + pageable.size);
    }

    getProjectCommentsNative(projectId, objectType, pageable) {
        this.http.getDataSerializer();
        return this.http.get(this.urlservice.viewInfo.restUrl + "api/col/comments?objectType=" + objectType + "&objectId=" + projectId + "&page=" + pageable.page + "&size=" + pageable.size, {}, {});
    }

    createInvitation(invitation) {
        return this.httpClient.post(this.urlservice.viewInfo.restUrl + "/api/common/invitations", invitation);
    }

    createComment(invitation) {
        return this.httpClient.post(this.urlservice.viewInfo.restUrl + "/api/common/invitations", invitation);
    }

    createCommentNative(comment) {
        this.http.setDataSerializer('json');
        return this.http.post(this.urlservice.viewInfo.restUrl + "api/col/comments", comment, {});
    }

    getSiteDetails(id) {
        return this.httpClient.get(this.urlservice.viewInfo.restUrl + "api/sites/" + id)
    }

    getSiteDetailsNative(id) {
        this.http.getDataSerializer();
        return this.http.get(this.urlservice.viewInfo.restUrl + "api/sites/" + id, {}, {})
    }

    getProblemDetails(id) {
        return this.httpClient.get(this.urlservice.viewInfo.restUrl + "api/issues/" + id + "/details")
    }

    getProblemDetailsNative(id) {
        this.http.getDataSerializer();
        return this.http.get(this.urlservice.viewInfo.restUrl + "api/issues/" + id + "/details", {}, {})
    }

    getProblemMedia(id) {
        return this.httpClient.get(this.urlservice.viewInfo.restUrl + "api/col/media/object/" + id);
    }

    getProblemMediaNative(id) {
        this.http.getDataSerializer();
        return this.http.get(this.urlservice.viewInfo.restUrl + "api/col/media/object/" + id, {}, {});
    }

    getSiteTasks(id) {
        return this.httpClient.get(this.urlservice.viewInfo.restUrl + "api/sites/" + id + "/tasks")
    }

    getSiteTasksNative(id) {
        this.http.getDataSerializer();
        return this.http.get(this.urlservice.viewInfo.restUrl + "api/sites/" + id + "/tasks", {}, {})
    }

    getProjectFiles(id) {
        return this.httpClient.get(this.urlservice.viewInfo.restUrl + "api/projects/" + id + "/folders/list")
    }

    getProjectFilesNative(id) {
        this.http.getDataSerializer();
        return this.http.get(this.urlservice.viewInfo.restUrl + "api/projects/" + id + "/folders/list", {}, {})
    }

    getProjectFolderFiles(id, folderId) {
        return this.httpClient.get(this.urlservice.viewInfo.restUrl + "api/projects/" + id + "/folders/" + folderId + "/files")
    }

    getProjectFolderFilesNative(id, folderId) {
        this.http.getDataSerializer();
        return this.http.get(this.urlservice.viewInfo.restUrl + "api/projects/" + id + "/folders/" + folderId + "/files", {}, {})
    }

    getSiteResources(id) {
        return this.httpClient.get(this.urlservice.viewInfo.restUrl + "api/sites/" + id + "/resources")
    }

    getSiteResourcesNative(id) {
        this.http.getDataSerializer();
        return this.http.get(this.urlservice.viewInfo.restUrl + "api/sites/" + id + "/resources", {}, {})
    }

    getProjectTeam(projectId) {
        return this.httpClient.get(this.urlservice.viewInfo.restUrl + "api/projects/" + projectId + "/persons")
    }

    getProjectTeamNative(projectId) {
        this.http.getDataSerializer();
        return this.http.get(this.urlservice.viewInfo.restUrl + "api/projects/" + projectId + "/persons", {}, {})
    }

    getSitesByProject(projectId) {
        return this.httpClient.get(this.urlservice.viewInfo.restUrl + "api/sites/" + projectId + "/siteList")
    }

    getSitesByProjectNative(projectId) {
        this.http.getDataSerializer();
        return this.http.get(this.urlservice.viewInfo.restUrl + "api/sites/" + projectId + "/siteList", {}, {})
    }

    getProjectWbs(projectId) {
        return this.httpClient.get(this.urlservice.viewInfo.restUrl + "api/projects/" + projectId + "/wbsList")
    }

    getProjectWbsNative(projectId) {
        this.http.getDataSerializer();
        return this.http.get(this.urlservice.viewInfo.restUrl + "api/projects/" + projectId + "/wbsList", {}, {})
    }

    getIssueTypes() {
        return this.httpClient.get(this.urlservice.viewInfo.restUrl + "api/issuetypes")
    }

    getIssueTypesNative() {
        this.http.getDataSerializer();
        return this.http.get(this.urlservice.viewInfo.restUrl + "api/issuetypes", {}, {})
    }

    createProblem(problem) {
        return this.httpClient.post(this.urlservice.viewInfo.restUrl + "api/issues", problem)
    }

    createProblemNative(problem) {
        this.http.setDataSerializer('json');
        return this.http.post(this.urlservice.viewInfo.restUrl + "api/issues", problem, {})
    }

    createTask(projectId, task) {
        return this.httpClient.post(this.urlservice.viewInfo.restUrl + "api/projects/" + projectId + "/tasks", task)
    }

    createTaskNative(projectId, task) {
        this.http.setDataSerializer('json');
        return this.http.post(this.urlservice.viewInfo.restUrl + "api/projects/" + projectId + "/tasks", task, {})
    }

    createSite(site) {
        return this.httpClient.post(this.urlservice.viewInfo.restUrl + "api/sites", site)
    }

    createSiteNative(site) {
        this.http.setDataSerializer('json');
        return this.http.post(this.urlservice.viewInfo.restUrl + "api/sites", site, {})
    }

    getTaskCompletionHistory(taskId) {
        return this.httpClient.get(this.urlservice.viewInfo.restUrl + "api/tasks/details/" + taskId)
    }

    getTaskCompletionHistoryNative(taskId) {
        this.http.setDataSerializer('json');
        return this.http.get(this.urlservice.viewInfo.restUrl + "api/tasks/details/" + taskId, {}, {})
    }

    updateTaskCompletionHistory(projectId, taskId, completion) {
        return this.httpClient.post(this.urlservice.viewInfo.restUrl + "api/projects/" + projectId + "/tasks/" + taskId + "/taskHistory", completion);
    }

    updateTaskCompletionHistoryNative(projectId, taskId, completion) {
        this.http.setDataSerializer('json');
        return this.http.post(this.urlservice.viewInfo.restUrl + "api/projects/" + projectId + "/tasks/" + taskId + "/taskHistory", completion, {});
    }
}
