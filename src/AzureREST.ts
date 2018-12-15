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

  //fetch  dashboard data by id
  async getDashboardData(projectName :string ,dashboardId : string){ 
    return axios.get(`${this.rootUrl}/${projectName}/_apis/dashboard/dashboards/${dashboardId}`);
  }//getProjectList

  //creates a dashboard
  async createDashboard(projectName :string ,dashboardObject : any){ 
    return axios.post(`${this.rootUrl}/${projectName}/_apis/dashboard/dashboards?api-version=4.1-preview.2`,dashboardObject);
  }//getProjectList

  //fetch Query folder by path
  async getQueryFolder(projectName :string ,folderPath : string){ 
    return axios.get(`${this.rootUrl}/${projectName}/_apis/wit/queries/${folderPath}?$expand=all`);
  }//getProjectList


  //fetch Query data by id
  async getQueryData(projectName :string ,queryId : string){ 
    return axios.get(`${this.rootUrl}/${projectName}/_apis/wit/queries/${queryId}?$expand=all`);
  }//getProjectList

  //creates a query
  async createQuery(projectName :string ,queryObject : any,queryPath:string){ 
    return axios.post(`${this.rootUrl}/${projectName}/_apis/wit/queries/${queryPath}?api-version=4.1`,queryObject);
  }//getProjectList

  //creates folder structure
  async createQueryPath(projectName:string,queryPath : string){
    let foldersByOrder = queryPath.split("/");
    console.log(foldersByOrder);
    let currentFolderToCheck :string = '';
    let currentFolderCreatePath : string ='';
    
    for (let i = 0; i < foldersByOrder.length-1; i++) {
      let res :any;
      currentFolderToCheck += `${foldersByOrder[i]}/`;
        try{
          res = await this.getQueryFolder(projectName,currentFolderToCheck);
        }catch(error){
          let res:any;
          console.log(error.response.data);
          //ADD ERROR HANDLING
          res = await this.createQuery(projectName,{"name":foldersByOrder[i],"isFolder": true},currentFolderCreatePath);
        }
      currentFolderCreatePath +=`${foldersByOrder[i]}/`;
    }
    return currentFolderCreatePath;
  }//createQueryPath

  async getQueryListFromDashboard(dashboardObject : any){
    console.log(dashboardObject);
  } 
}//class