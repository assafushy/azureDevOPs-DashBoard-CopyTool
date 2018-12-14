import azureREST from './AzureREST';
import _ from 'lodash';
var inquirer = require('inquirer');
var figlet = require('figlet');
var chalk = require('chalk');

export default class Main{

restClient : any;
  
//show welcome screen
printappHeader(str : string){
  return new Promise((resolve,reject)=>{
    console.log(chalk.yellow(figlet.textSync(str, { horizontalLayout: 'full' })))
    console.log('\n');
    resolve(true);
  })//Promise
}//printappHeader

//get connection data
async getConnectionData(){
  let config:any;
  let answer = await inquirer.prompt([{"type":"list","name":"selectType",
      "message":"How do you want to pass your connection data ?",
      "choices":["Manual Typing","JSON Config file"]}]);
  switch(answer.selectType){
    case 'Manual Typing':{
      //if via manual typing
      let baseUrl = await inquirer.prompt([{"type":"input","name":"rootUrl",
          "message":"Please type the root url:"}]);
      let PAT = await inquirer.prompt([{"type":"input","name":"PAT",
          "message":"Please type your Personal Access Token(PAT):"}]);
      return({"baseUrl":baseUrl,"PAT":PAT});
    break;
    }
    case 'JSON Config file':{
      //if via config file
      console.log(`make sure you suppliy a JSON file path with properties: {rootUrl:***,PAT:***}`);
      let configPath = await inquirer.prompt([{"type":"input","name":"configPath",
          "message":"Please type the path of the config file:"}]);
      if(configPath.configPath){config = require(configPath.configPath)}
      if(config.rootUrl && config.PAT){
        return({"baseUrl":config.rootUrl,"PAT":config.PAT});
      }else{
        console.error('Please fix your config file');
      }
    break;
    }
    default:
    break;
  }
}//getConnectionData

//connect to azureDevOps
async connectToAzureDevops(rootUrl : string,PAT : string){
  let res : any;
  this.restClient = new azureREST(rootUrl,PAT);
    try{
       res = await this.restClient.getProjectList();
    }catch(error){
      console.error("Error fetching TeamProjects - please check --  baseURL and your PAT");
    }
    return res.data.value;
}//connectToAzureDevops

//get project list
async selectATeamProject(projectList : any ){ 
  //select relavnt project to copy from
  let selectedProject : any;
  let config : any; 
  let answer = await inquirer.prompt([{"type":"list","name":"selectType",
  "message":"How do you want to pass your connection data ?",
  "choices":["Select from list","JSON Config file"]}]);
  switch(answer.selectType){
    case 'Select from list':{
      let projectNames : any = await Promise.all(projectList.map((project : any)=>{return project.name}));
      //if via manual select from list
      selectedProject = await inquirer.prompt([{"type":"list","name":"selectedProject",
      "message":"Please select a project to copy from:",
      "choices":projectNames}]);
      return(selectedProject.selectedProject);
    break;
    }
    case 'JSON Config file':{
      //if via config file
      console.log(`make sure you suppliy a JSON file path with properties: {projectName:****}`);
      let configPath = await inquirer.prompt([{"type":"input","name":"configPath",
          "message":"Please type the path of the config file:"}]);
      if(configPath.configPath){config = require(configPath.configPath)}
      if(config.projectName){
        let projectCheck = _.findIndex(projectList,(o : any)=>{return o.name === config.projectName});
        if(projectCheck>=0){
          return(config.projectName);
        }else{
          console.error('Please fix your config file');  
        }
      }else{
        console.error('Please fix your config file');
      }
    break;
    }
    default:
    break;
  }
}//selectATeamProject

//get dashboard list
async getDashboardList(projectName : string){
  let res : any;
      try{
         res = await this.restClient.getDashboardList(projectName);
      }catch(error){
        console.error("Error fetching TeamProjects - please check --  baseURL and your PAT");
      }
      console.log(res.data);
}
//select relavnt dashboard to copy from
async selectFromList(list : any, TypeToSelect : string ){ 
  //select relavnt project to copy from
  let selected : any;
  let config : any; 
  let answer = await inquirer.prompt([{"type":"list","name":"selectType",
  "message":"How do you want to pass your connection data ?",
  "choices":["Select from list","JSON Config file"]}]);
  switch(answer.selectType){
    case 'Select from list':{
      let titles : any = await Promise.all(list.map((item : any)=>{return item.name}));
      //if via manual select from list
      selected = await inquirer.prompt([{"type":"list","name":"selected",
      "message":`Please select a ${TypeToSelect} to copy from:`,
      "choices":titles}]);
      let i = _.findIndex(list,(item : any)=>{return item.name === selected.selected})
      return(list[i]);
    break;
    }
    case 'JSON Config file':{
      //if via config file
      let configPath = await inquirer.prompt([{"type":"input","name":"configPath",
          "message":"Please type the path of the config file:"}]);
      if(configPath.configPath){config = require(configPath.configPath)}
      if(config.projectName){
        let i = _.findIndex(list,(o : any)=>{return o.name === config.dashboardName});
        if(i>=0){
          return(list[i]);
        }else{
          console.error('Please fix your config file');  
        }
      }else{
        console.error('Please fix your config file');
      }
    break;
    }
    default:
    break;
  }
}//selectFromList
  //if via config file
  //if via manual select from list

//select relavnt project to copy from
  //if via config file
  //if via manual select from list

//copy dashboard

async main(){
  await this.printappHeader("DashBoard - Copy Tool");
  let azureParams : any = await this.getConnectionData(); 
  let projectList = await this.connectToAzureDevops(azureParams.baseUrl,azureParams.PAT);
  let selectedProject = await this.selectATeamProject(projectList);
  let dashBoardList = await this.getDashboardList(selectedProject);
  let selectedDashboard = await this.selectFromList(dashBoardList,'dashboard');
  console.log(`selected ${selectedDashboard}`);
}

}