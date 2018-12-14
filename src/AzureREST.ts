import axios from 'axios';

export default class AzureREST{

  rootUrl : string;

  constructor(rootUrl : string,PAT : string){
    this.rootUrl  = rootUrl;
    axios.defaults['auth'] = {"username":'',"password":PAT};
  }

//fetches all teamProjects
async getProjectList(){ 
  return axios.get(`${this.rootUrl}/_apis/projects`);
}//getProjectList
 
//fetch all dashboards for a team project
async getDashboardList(projectName : string){ 
  //?api-version=5.0-preview.2
  return axios.get(`${this.rootUrl}/${projectName}/_apis/dashboard/dashboards`);
}//getProjectList
}