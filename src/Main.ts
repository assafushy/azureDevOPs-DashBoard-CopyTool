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

//connect to azureDevOps and get project list
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

//get dashboard list
async getDashboardList(projectName : string){
  let res : any;
  try{
      res = await this.restClient.getDashboardList(projectName);
  }catch(error){
    console.error("Error fetching TeamProjects - please check --  baseURL and your PAT");
  }
  return res.data.dashboardEntries;
}//getDashboardList

//get dashboard list
async getDashboardData(projectName : string,dashboardId :string){
  let res : any;
  try{
      res = await this.restClient.getDashboardData(projectName,dashboardId);
  }catch(error){
    console.error("Error fetching TeamProjects - please check --  baseURL and your PAT");
  }
  return res.data;
}//getDashboardList

//copy dashboard
async copyDashboard(projectToName : string , dashboardObject : any){
  let res : any;
  delete dashboardObject.id;

  try{
      res = await this.restClient.createDashboard(projectToName,dashboardObject);
  }catch(error){
    console.error("Error fetching TeamProjects - please check --  baseURL and your PAT");
    console.log(error.response);
  }//try
}//copyDashboard

async inputfromSelect(){
  let answer = await inquirer.prompt([{"type":"list","name":"selectType",
  "message":"How do you want to pass your connection data ?",
  "choices":["Select from list","JSON Config file"]}]);
  switch(answer.selectType){
    case 'Select from list':{
      return 'list';
    }
    case 'JSON Config file':{
      console.log(`Please make sure before you proceed, that your config file cantains the following properties:
      {
        projectFrom:<your project to copy from name>,
        dashboardFrom:<your dashboard or dashboards to copy from name>
      } `);
      return 'json';
    }
  }//switch
}//inputfromSelect

//select relavnt item from list
async selectFromList(list : any, actionToSelect : string){ 
  let selected : any;
  let titles : any = await Promise.all(list.map((item : any)=>{return item.name}));
  selected = await inquirer.prompt([{"type":"list","name":"selected",
  "message":actionToSelect,
  "choices":titles}]);
  let i = _.findIndex(list,(item : any)=>{return item.name === selected.selected})
  return(list[i]);   
}//selectFromList

async createNewDashboardObject(dashboardObject:any){
  //iterate Dashboards Widgets
  dashboardObject.widgets.forEach((widget : any) => { 
    //get Settings property
    console.log(`\n widget setting:`)
    console.log(widget.settings);
    
    //all known cases:
    console.log(widget.settings.queryId)
    if(widget.settings.queryId){
      console.log(`found queryId: ${widget.settings.queryId}`);
    }//if
    if(widget.settings.query){
      if(widget.settings.query.queryId){
        console.log(`found query.queryId: ${widget.settings.query.queryId}`);
      }//if
    }//if
    if(widget.settings.groupKey){
      console.log(`found groupKey: ${widget.settings.groupKey}`);
    }//if
    if(widget.settings.transformOptions){
      if(widget.settings.transformOptions.filter){
        console.log(`found transformOptions.filter: ${widget.settings.transformOptions.filter}`);
      }//if
    }//if
    
    //check if a duplicate query was created
    //yes - replace id
    //no - 
    //create duplicate
    //register in duplicates array
    //replace in dashboardObject
  });//foreach
  }//createNewDashboardObject


async runBaseOnConfigFIle(){
  //  //if via config file
  //  let configPath = await inquirer.prompt([{"type":"input","name":"configPath",
  //  "message":"Please type the path of the config file:"}]);
  // if(configPath.configPath){config = require(configPath.configPath)}
  // if(config.projectName){
  // let i = _.findIndex(list,(o : any)=>{return o.name === config.dashboardName});
  // if(i>=0){
  //  return(list[i]);
  // }else{
  //  console.error('Please fix your config file');  
  // }
  // }else{
  // console.error('Please fix your config file');
  // }
}//runBaseOnConfigFIle


async main(){
  await this.printappHeader("DashBoard - Copy Tool");
  let azureParams : any = await this.getConnectionData(); 
  let projectList = await this.connectToAzureDevops(azureParams.baseUrl,azureParams.PAT);
  let inputFrom = await this.inputfromSelect();
  if(inputFrom === 'list'){
    let selectedProjectFrom = await this.selectFromList(projectList,'Please select a project to copy from:' );
    let dashBoardList = await this.getDashboardList(selectedProjectFrom.name);
    let selectedDashboard = await this.selectFromList(dashBoardList,'Please select a dashboard to copy:');
    let dashBoardDetails = await this.getDashboardData(selectedProjectFrom.name,selectedDashboard.id);
    let isCloneQueries = await this.selectFromList([{name:'Yes'},{name:'No'}],'Do you want to clone all dashboard queries?');
    let selectedProjectTo = await this.selectFromList(projectList,'Please select a project to copy from:' );
    if(isCloneQueries.name === 'Yes'){
      await this.createNewDashboardObject(dashBoardDetails);
    }
    // await this.copyDashboard(selectedProjectTo.name,dashBoardDetails);
    console.log(`Thanks for using if you like please add a star on github`);
  }else{
    //run base on config file
  }//if
}//main

}//class